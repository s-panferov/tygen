import * as ts from 'typescript'
import { Context } from '../context'
import { isParameter } from './variable'
import { ReflectionPath, ReflectionId, ReflectionKind } from './reflection'
import { symbolToKnownReflectionKind } from './visitor'

export function symbolId(
	symbol: ts.Symbol,
	ctx: Context,
	parentSymbol?: ts.Symbol
): ReflectionPath {
	return generateIdChainForSymbol(symbol, ctx, parentSymbol)
}

export function declarationId(node: ts.Node, ctx: Context): ReflectionPath {
	return generateIdChainForDeclaration(node, ctx, false)
}

function generateIdChainForSymbol(
	symbol: ts.Symbol,
	ctx: Context,
	parentSymbol?: ts.Symbol
): ReflectionPath {
	let id = [] as ReflectionId[]

	if (!symbol) {
		debugger
		throw new Error('WAT?')
	}

	let declarations = symbol.declarations
	if (declarations && declarations.length > 0) {
		let node = declarations[0]!
		return generateIdChainForDeclaration(node, ctx, false)
	} else {
		let parent = (symbol as any).parent || parentSymbol
		if (parent) {
			id.push(...generateIdChainForSymbol(parent, ctx))
		}

		if (symbol.name) {
			let kind = symbolToKnownReflectionKind(symbol)
			if (!kind) {
				throw new Error('Unknown kind, please debug...')
			}
			id = concatIdentifier(id, {
				kind,
				name: symbol.escapedName.toString()
			})
		} else {
			id = concatIdentifier(id, {
				kind: ReflectionKind.NotSupported,
				name: '__type'
			})
		}
	}

	if (id[0].kind !== ReflectionKind.Package) {
		throw new Error('Strange id, please investigate')
	}

	return id
}

export function idFromPath(reflectionPath: ReflectionPath): ReflectionId {
	return reflectionPath[reflectionPath.length - 1]
}

export function concatIdentifier(
	segments: ReflectionId[],
	newSegment: Pick<ReflectionId, Exclude<keyof ReflectionId, 'fileName' | 'anchor'>>
): ReflectionId[] {
	const writable: ReflectionId[] = []
	const anchor: ReflectionId[] = []

	let notWritableAlready = false

	const finalSegment = newSegment as ReflectionId
	const finalSegments = segments.concat(finalSegment)

	finalSegments.forEach(seg => {
		if (isWritableReflection(seg.kind)) {
			if (notWritableAlready) {
				throw new Error('Writable reflection after a non-writable, please debug')
			}
			writable.push(seg)
		} else {
			notWritableAlready = true
			anchor.push(seg)
		}
	})

	if (!writable.length) {
		throw new Error('At least one of the ID segments should be writable')
	}

	if (finalSegments[0].kind !== ReflectionKind.Package) {
		throw new Error('Typical ID should start with a Package')
	}

	finalSegment.fileName = writable.map(stringifySegment).join('/')

	finalSegment.anchor = slugify(
		[idFromPath(writable)]
			.concat(anchor)
			.map(stringifySegment)
			.join('/')
	)

	return finalSegments
}

export function stringifyId(id: ReflectionPath) {
	return id.map(stringifySegment).join('/')
}

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '-') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, '')
}

export function stringifySegment(seg: ReflectionId): string {
	return `${seg.kind !== 'Package' ? `(${seg.kind})` : ''}${
		seg.keywords ? seg.keywords.map(k => `(${k})`) : ''
	}${seg.name}${seg.version ? '/' + seg.version : ''}`
}

function isStatic(node: ts.Declaration) {
	return ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static
}

export function isWritableReflection(kind: ReflectionKind) {
	switch (kind) {
		case ReflectionKind.Package:
		case ReflectionKind.Folder:
		case ReflectionKind.Interface:
		case ReflectionKind.Module:
		case ReflectionKind.Namespace:
		case ReflectionKind.Class:
		case ReflectionKind.Function:
		case ReflectionKind.Variable:
		case ReflectionKind.TypeAlias:
		case ReflectionKind.Enum:
			return true
		default:
			return false
	}
}

export function isWritableSymbol(symbol: ts.Symbol) {
	return !!(
		symbol.flags & ts.SymbolFlags.Interface ||
		symbol.flags & ts.SymbolFlags.Module ||
		symbol.flags & ts.SymbolFlags.NamespaceModule ||
		symbol.flags & ts.SymbolFlags.Class ||
		symbol.flags & ts.SymbolFlags.Function ||
		(symbol.flags & ts.SymbolFlags.Variable && !isParameter(symbol)) ||
		symbol.flags & ts.SymbolFlags.TypeAlias ||
		symbol.flags & ts.SymbolFlags.Enum
	)
}

export function generateIdForSourceFile(
	sourceFile: ts.SourceFile,
	ctx: Context,
	addFilePath: boolean = true
): ReflectionPath {
	let id = [] as ReflectionId[]

	const fileName = sourceFile.fileName
	const module = ctx.generator.getFile(fileName)!

	id = concatIdentifier(id, {
		name: module.pkg.manifest.name,
		version: module.pkg.manifest.version,
		kind: ReflectionKind.Package
	})

	if (addFilePath) {
		id = concatIdentifier(id, {
			name: module.pathInfo.relativePath,
			kind: ReflectionKind.Module
		})
	}

	return id
}

function generateIdChainForDeclaration(
	node: ts.Node,
	ctx: Context,
	isParent: boolean
): ReflectionPath {
	let id = [] as ReflectionId[]
	let keywords = undefined as string[] | undefined

	const parent = node.parent
	if (parent) {
		id.push(...generateIdChainForDeclaration(parent, ctx, true))
		if (ts.isIntersectionTypeNode(parent) || ts.isUnionTypeNode(parent)) {
			;(keywords = keywords || []).push(parent.types.indexOf(node as ts.TypeNode).toString())
		}
	}

	if (ts.isSourceFile(node)) {
		let symbol = ctx.checker.getSymbolAtLocation(node)
		symbol = symbol && ctx.checker.getMergedSymbol(symbol)
		// !!symbol check is true for ES6 modules and false for ambient declarations
		id.push(...generateIdForSourceFile(node.getSourceFile(), ctx, !!symbol))
	} else if (
		ts.isMethodDeclaration(node) ||
		ts.isMethodSignature(node) ||
		ts.isFunctionDeclaration(node) ||
		ts.isCallSignatureDeclaration(node) ||
		ts.isConstructSignatureDeclaration(node)
	) {
		let symbol: ts.Symbol | undefined =
			(node as any).symbol || ctx.checker.getSymbolAtLocation(node)

		symbol = symbol && ctx.checker.getMergedSymbol(symbol)

		const name = node.name ? node.name.getText() : symbol ? symbol.name : '__function'

		if (isStatic(node)) {
			;(keywords = keywords || []).push('static')
		}

		if (symbol && symbol.declarations && symbol.declarations.length > 1 && isParent) {
			;(keywords = keywords || []).push(`overload-${symbol.declarations.indexOf(node)}`)
		}

		id = concatIdentifier(id, {
			kind:
				symbol && symbol.flags & ts.SymbolFlags.Function
					? ReflectionKind.Function
					: ReflectionKind.Method,
			name: name,
			keywords
		})
	} else if (ts.isTypeParameterDeclaration(node)) {
		id = concatIdentifier(id, {
			kind: ReflectionKind.TypeParameter,
			name: node.name.getText(),
			keywords
		})
	} else if (ts.isPropertyDeclaration(node) || ts.isPropertyAssignment(node)) {
		if (isStatic(node)) {
			;(keywords = keywords || []).push('static')
		}

		id = concatIdentifier(id, {
			kind: ReflectionKind.Property,
			name: node.name.getText(),
			keywords
		})
	} else if (ts.isModuleBlock(node)) {
		// skip
	} else if (ts.isUnionTypeNode(node)) {
		id = concatIdentifier(id, {
			kind: ReflectionKind.UnionType,
			name: 'union'
		})
	} else if (ts.isIntersectionTypeNode(node)) {
		id = concatIdentifier(id, {
			kind: ReflectionKind.IntersectionType,
			name: 'intersection'
		})
	} else if (ts.isModuleDeclaration(node)) {
		id = concatIdentifier(id, {
			kind: ReflectionKind.Module,
			name: node.name.getText().replace(/"|'/g, ''),
			keywords
		})
	} else {
		let symbol: ts.Symbol | undefined =
			(node as any).symbol || ctx.checker.getSymbolAtLocation(node)

		symbol = symbol && ctx.checker.getMergedSymbol(symbol)

		if (symbol && symbol.escapedName) {
			let kind = symbolToKnownReflectionKind(symbol)
			if (!kind) {
				throw new Error('Unknown kind, please debug...')
			}
			id = concatIdentifier(id, {
				kind,
				name: symbol.escapedName.toString(),
				keywords
			})
		} else {
			let name = ((node as any) as { name?: ts.Identifier }).name
			if (name && name.text) {
				id = concatIdentifier(id, {
					kind: ReflectionKind.NotSupported,
					name: name.text
				})
			} else if (
				node.kind === ts.SyntaxKind.VariableStatement ||
				node.kind === ts.SyntaxKind.VariableDeclarationList
			) {
				// just ignore
			} else {
				id = concatIdentifier(id, {
					kind: ReflectionKind.NotSupported,
					name: '__type'
				})
			}
		}
	}

	return id
}
