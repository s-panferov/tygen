require('source-map-support').install()

import { extractPackage, getFileInfo } from './utils'
import { processSourceFile } from './gen'
import { Item, ItemType } from './items'
import * as path from 'path'

import { isModuleDeclaration, isStringLiteral } from './ast/module'

export { Item, ItemType }

import {
	TypeChecker,
	Program,
	SourceFile,
	Symbol,
	Node,
	LanguageService,
	SyntaxKind,
	Declaration
} from 'typescript'

import * as typescript from 'typescript'

export interface Package {
	info: PackageInfo
	path: string
}

export interface PackageInfo {
	name: string
	version: string
	description: string
	docscript?: {
		defaultPath?: string
	}
}

export interface FileInfo {
	relativeToPackage: string
	withPackage: string
	metaName: string
}

export enum ModuleKind {
	TypeScript = 'typescript' as any
}

export interface ModuleInfo {
	kind: ModuleKind
	text: string
	pkgName: string
	fileInfo: FileInfo
	internal: boolean
	semanticIdMap: { [semantiId: string]: string }
	items: [string, string, string, boolean][]
	itemsIndex: { [id: string]: Item }
}

export interface IdMap {
	[key: string]: [string, string, string, string[]]
}

export interface SemanticIdMap {
	[pkg: string]: { [path: string]: { [semanticId: string]: string } }
}

export interface DocRegistry {
	mainPackage: string
	files: Dictionary<boolean>
	idMap: IdMap
	semanticIdMap: SemanticIdMap
	packages: Dictionary<PackageInfo>
}

function isNode(node: Symbol | Node): node is Node {
	return !!(node as any).kind
}

export interface Ref {
	id?: string
	pkg?: string
	path?: string
	mainId?: string
	semanticId?: string
	mainSemanticId?: string
}

/**
 * Contains all documents
 */
export class Context {
	modules: Dictionary<Module> = {}
	ts = typescript
	checker: TypeChecker = null
	program: Program
	service: LanguageService

	mainPackage: string
	packages: Dictionary<Package> = {}

	currentModule: Module
	currentModuleStack: Module[] = []
	currentStack: Symbol[]
	currentId: number

	foreign = false
	internalModuleStack = []

	ids: WeakMap<any, string>
	_visited: WeakMap<any, boolean>

	includeAllowed: boolean = true
	foreignItems: { [itemId: string]: boolean } = {}
	foreignModules: { [fileName: string]: [SourceFile, Package] } = {}

	constructor(mainPackage: string) {
		this.ids = new WeakMap()
		this._visited = new WeakMap()
		this.currentStack = []
		this.currentId = 1
		this.mainPackage = mainPackage
	}

	inCurrentContext(symbol: Symbol): boolean {
		return this.currentStack.indexOf(symbol) !== -1
	}

    /**
     * Mark `id` to be included into documentation
     * @param id - id to be included
     */
	include(id: string) {
		if (this.includeAllowed) {
			this.foreignItems[id] = true
		}
	}

    /**
     * Check if `id` has been included into documentation
     * @param id - id to be checkes
     * @return - `true` if id is included
     */
	included(id: string): boolean {
		return !!this.foreignItems[id]
	}

	dive<T>(level: Symbol | Node, func: () => T): T {
		let symbol: Symbol
		if (isNode(level)) {
			symbol = this.checker.getTypeAtLocation(level).getSymbol()
		} else {
			symbol = level
		}

		if (!symbol) {
			console.error(level)
			throw new Error(`Can't find the symbol`)
		}

		symbol.declarations.forEach(decl => {
			this.visit(decl)
		})

		this.currentStack.push(symbol)
		let result = func()
		this.currentStack.pop()

		return result
	}

	visit(obj: any) {
		this._visited.set(obj, true)
	}

	isVisited(obj: any): boolean {
		return this._visited.get(obj)
	}

	mainId(): string {
		if (this.currentStack[0]) {
			return this.getSymbolName(this.currentStack[0])
		} else {
			return null
		}
	}

	getSymbolName(sym: Symbol) {
		let name: string
		sym.declarations.some(decl => {
			if (decl.name) {
				name = decl.name.getText()
				return true
			}
		})

		return name || sym.name
	}

	semanticId(id: string, level?: string): string {
		let currentStack = this.currentStack.map(this.getSymbolName)
		if (level) {
			currentStack = currentStack.concat(level)
		}
		let resultId = currentStack.join('.')
		this.currentModule.semanticIdMap[resultId] = id

		return resultId
	}

	id(object?: any): string {
		this.currentId++
		if (object) {
			if (!this.ids.has(object)) {
				this.ids.set(object, (this.currentId).toString())
				// this.ids.set(object, uuid.v1())
			}

			return this.ids.get(object)
		} else {
			return (this.currentId).toString()
		}
	}

	setProgram(program: Program) {
		this.program = program
		this.checker = this.program.getTypeChecker()
	}

	setService(service: LanguageService) {
		this.service = service
	}

	processInternalModule(name: string, sourceFile: any, packageLike: boolean) {
		let pkg: Package
		let moduleName = name
		if (packageLike) {
			moduleName = 'index'
			pkg = this.packages[name]
			if (!pkg) {
				pkg = this.packages[name] = {
					path: `/${name}`,
					info: {
						name,
						version: '',
						description: '.d.ts'
					}
				}
			}
		} else {
			pkg = this.packages[this.currentModule.pkgName]
		}

		this.internalModuleStack.push(moduleName)

		let modulePath = path.join.apply(path, [
			pkg.path,
			!packageLike ? this.currentModuleStack[0].fileInfo.relativeToPackage : null,
			path.join.apply(path, this.internalModuleStack)
		].filter(Boolean))

		let module = this.generateModule(
			modulePath,
			sourceFile,
			pkg,
			true
		)

		this.internalModuleStack.pop()
		this.modules[modulePath] = module
	}

	addModule(fileName, sourceFile: SourceFile) {
		let pkg = extractPackage(fileName)
		let name = pkg.info.name
		this.packages[name] = pkg

		if (name === this.mainPackage) {
			let module = this.generateModule(fileName, sourceFile, pkg, false)
			this.modules[fileName] = module
		} else {
			this.foreignModules[fileName] = [sourceFile, pkg]
		}
	}

	generateForeignModules(includeAllowed: boolean = true) {
		let prevIncludeAllowed = this.includeAllowed
		this.includeAllowed = includeAllowed
		this.foreign = true
		Object.keys(this.foreignModules).forEach(fileName => {
			let [sourceFile, pkg] = this.foreignModules[fileName]
			let module = this.generateModule(fileName, sourceFile, pkg, false)
			this.modules[fileName] = module
		})

		this.includeAllowed = prevIncludeAllowed
	}

	getModule(fileName: string): Module {
		return this.modules[fileName]
	}

	routeForSym(sym: Symbol): Ref {
		let fileName = sym.declarations[0].getSourceFile().fileName

		let pkg = extractPackage(fileName)
		let fileInfo = getFileInfo(fileName, pkg)
		let decl = sym.declarations[0]

		let modulePath = ''
		let resultPath = ''
		let resultPkg = pkg.info.name
		let current = decl
		let mainId = '' as string
		let mainSemanticId = '' as string

		if (decl.kind === SyntaxKind.SourceFile) {
			// reference to value module
			return { pkg: resultPkg, path: fileInfo.relativeToPackage }
		}

		if (decl.parent.kind === SyntaxKind.SourceFile) {
			mainId = this.id(sym)
			mainSemanticId = getSemanticId(decl)
		}

		function getSemanticId(decl: Declaration): string {
			switch (decl.kind) {
				case SyntaxKind.InterfaceDeclaration:
				case SyntaxKind.ClassDeclaration:
				case SyntaxKind.EnumDeclaration:
				case SyntaxKind.FunctionDeclaration:
				case SyntaxKind.ModuleDeclaration:
				case SyntaxKind.MethodDeclaration:
				case SyntaxKind.PropertyDeclaration:
				case SyntaxKind.TypeAliasDeclaration:
					return decl.name.getText()
			}
		}

		let semanticId = getSemanticId(decl)

		while (current = current.parent as any) {
			if (current.parent && current.parent.kind == SyntaxKind.SourceFile) {
				let type = this.checker.getTypeAtLocation(current)
				let sym = type.getSymbol()

				if (!isModuleDeclaration(current)) {
					mainId = this.id(sym || type)
					mainSemanticId = getSemanticId(current)
				}
			}

			if (semanticId && !isModuleDeclaration(current)) {
				let parentSemanticId = getSemanticId(current)
				if (parentSemanticId) {
					semanticId = parentSemanticId + '.' + semanticId
				}
			}

			if (isModuleDeclaration(current)) {
				let name = current.name
				if (isStringLiteral(name)) {
					modulePath = `/${modulePath}/index`
					resultPath = modulePath
					resultPkg = name.text
					break
				} else {
					modulePath = `/${name.text}${modulePath}`
				}
			}
		}

		if (!resultPath) {
			resultPath = fileInfo.relativeToPackage + modulePath
		}

		return { pkg: resultPkg, path: resultPath, mainId, semanticId, mainSemanticId }
	}

	private generateModule(fileName: string, source: SourceFile, pkg: Package, internal: boolean): Module {
		console.time(fileName)

		let fileInfo = getFileInfo(fileName, pkg)
		let doc = new Module(source, pkg.info.name, fileInfo, internal)

		this.currentModule = doc
		this.currentModuleStack.push(this.currentModule)

		processSourceFile(source as any, this, this.foreign)

		this.currentModuleStack.pop()
		this.currentModule = this.currentModuleStack[this.currentModuleStack.length - 1]

		console.timeEnd(fileName)

		return doc
	}
}

export class Module {
	kind = ModuleKind.TypeScript
	text: string
	pkgName: string
	fileInfo: FileInfo
	internal: boolean
	shortForm: boolean

	items: Item[] = []
	itemsIndex: { [id: string]: Item } = {}
	semanticIdMap: { [key: string]: string } = {}

	constructor(sourceFile: SourceFile, pkgName: string, fileInfo: FileInfo, internal: boolean) {
		this.pkgName = pkgName
		this.fileInfo = fileInfo
		this.internal = internal
	}

	toJSON() {
		let { pkgName, fileInfo, items, kind, internal, semanticIdMap, itemsIndex } = this
		let result = { kind, pkgName, fileInfo, internal, semanticIdMap, items: null, itemsIndex: null }
		if (!this.shortForm) {
			let shortItems = items.map(item => {
				let res = [item.selfRef, item.itemType, item.name]
				if ((item as any).exported) {
					res.push((item as any).exported)
				}

				return res
			})

			result.items = shortItems
		} else {
			result.itemsIndex = itemsIndex
		}

		return result
	}
}
