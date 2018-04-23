import * as path from 'path'
import * as fse from 'fs-extra'
import { Module } from './module'
import {
	BaseReflection,
	ReflectionKind,
	ReflectionLink,
	createLink,
	Reflection
} from './reflection/reflection'
import { REFUSED } from 'dns'
import { Context } from './context'
import { ESModuleReflection } from './reflection'
import { createLoopVariable } from 'typescript'

const { Volume } = require('memfs')
const closest = require('pkg-up')

export interface PackageReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithStructure {
	kind: ReflectionKind.Package
	manifest: Manifest
}

export interface ReflectionWithReadme {
	readme?: string
}

export interface ReflectionWithStructure {
	id?: string
	modules: Reflection[]
}

export interface FolderReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithStructure {
	kind: ReflectionKind.Folder
}

export interface Manifest {
	name: string
	version: string
}

export interface PackageFields {
	folderPath: string
	manifestFilePath: string
	manifest: Manifest
	modules: Map<string, Module>
}

export interface Package extends PackageFields {}

export class Package {
	volume = Volume.fromJSON({}) as typeof fse

	constructor(contents: PackageFields) {
		this.folderPath = contents.folderPath
		this.manifestFilePath = contents.manifestFilePath
		this.manifest = contents.manifest
		this.modules = contents.modules
	}

	/**
	 * Extract package information for fileName
	 */
	static fromPath(fileName: string, cache?: Map<string, Package>): Package {
		// TODO cache
		const manifestFilePath = closest.sync(path.dirname(fileName))
		const folderPath = path.dirname(manifestFilePath)

		const existed = cache && cache.get(folderPath)
		if (existed) {
			return existed
		}

		return new Package({
			manifestFilePath,
			folderPath,
			manifest: JSON.parse(fse.readFileSync(manifestFilePath).toString()),
			modules: new Map()
		})
	}

	addModule(mod: Module) {
		this.modules.set(mod.sourceFile.fileName, mod)
	}

	generate(ctx: Context) {
		const packageRef: PackageReflection = {
			kind: ReflectionKind.Package,
			id: `${this.manifest.name}::${this.manifest.version}`,
			manifest: this.manifest,
			modules: []
		}

		ctx.registerReflectionById(packageRef)

		this.modules.forEach(mod => {
			this.volume.mkdirpSync(path.dirname(mod.pathInfo.relativePath))
			this.volume.writeFileSync(mod.pathInfo.relativePath, mod.reflection.id)
		})

		visitReadme(this.folderPath, packageRef)
		visitFolders(this.volume, [packageRef], ctx)
	}
}

function visitReadme(folderPath: string, parent: ReflectionWithReadme) {
	const files = fse.readdirSync(folderPath)
	const readmeIndex = files.findIndex(file => file.toLowerCase() === 'readme.md')
	if (readmeIndex !== -1) {
		const readmePath = path.join(folderPath, files[readmeIndex])
		const readmeContent = fse.readFileSync(readmePath).toString()
		parent.readme = readmeContent
	}
}

export function visitFolders(
	volume: typeof fse,
	parents: ReflectionWithStructure[],
	ctx: Context,
	root = '.'
) {
	const lastParent = parents[parents.length - 1]
	const res = volume.readdirSync(root)

	let addTo: ReflectionWithStructure[]

	if (res.length > 1) {
		addTo = [lastParent]
	} else {
		addTo = parents
	}

	res.forEach(item => {
		const fullPath = path.join(root, item)
		if (volume.statSync(fullPath).isDirectory()) {
			const folderRef: FolderReflection = {
				id: `${lastParent.id}::${item}`,
				kind: ReflectionKind.Folder,
				modules: []
			}

			ctx.registerReflectionById(folderRef)

			let ref = createLink(folderRef)
			if (res.length > 1) {
				addTo.forEach(parent => {
					parent.modules.push(ref)
				})
			}

			visitFolders(volume, addTo, ctx, fullPath)
		} else {
			const id = volume.readFileSync(fullPath).toString()
			const ref = createLink(ctx.reflectionById.get(id)!)
			addTo.forEach(parent => {
				parent.modules.push(ref)
			})
		}
	})
}
