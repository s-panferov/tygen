import * as ts from 'typescript'
import { Context } from '../context'
import { isParameter } from './variable'
import { Identifier, IdentifierSegment, ReflectionKind } from './reflection'
import { symbolToKnownReflectionKind } from './visitor'

export function symbolId(symbol: ts.Symbol, ctx: Context): Identifier {
	return generateIdChainForSymbol(symbol, ctx)
}

export function declarationId(node: ts.Node, ctx: Context): Identifier {
	return generateIdChainForDeclaration(node, ctx, false)
}

function generateIdChainForSymbol(symbol: ts.Symbol, ctx: Context): Identifier {
	let id = [] as IdentifierSegment[]

	if (!symbol) {
		debugger
		throw new Error('WAT?')
	}

	let declarations = symbol.declarations
	if (declarations && declarations.length > 0) {
		let node = declarations[0]!
		return generateIdChainForDeclaration(node, ctx, false)
	} else {
		let parent = (symbol as any).parent
		if (parent) {
			id.push(...generateIdChainForSymbol(parent, ctx).segments)
		}

		if (symbol.name) {
			let kind = symbolToKnownReflectionKind(symbol)
			if (!kind) {
				throw new Error('Unknown kind, please debug...')
			}
			id.push({
				kind,
				name: symbol.escapedName.toString()
			})
		} else {
			id.push({
				kind: ReflectionKind.NotSupported,
				name: '__type'
			})
		}
	}

	return identifier(id)
}

export function identifier(segments: IdentifierSegment[]): Identifier {
	let writable: IdentifierSegment[] = []
	let anchor: IdentifierSegment[] = []

	let notWritableAlready = false

	segments.forEach(seg => {
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

	return {
		segments,
		fileName: writable.map(stringifySegment).join('/'),
		anchor: slugify(
			[writable[writable.length - 1]]
				.concat(anchor)
				.map(stringifySegment)
				.join('/')
		)
	}
}

export function stringifyId(id: Identifier) {
	return id.segments.map(stringifySegment).join('/')
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

export function stringifySegment(seg: IdentifierSegment): string {
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
): Identifier {
	let id = [] as IdentifierSegment[]

	const fileName = sourceFile.fileName
	const module = ctx.generator.getFile(fileName)!

	id.push({
		name: module.pkg.manifest.name,
		version: module.pkg.manifest.version,
		kind: ReflectionKind.Package
	})

	if (addFilePath) {
		id.push({
			name: module.pathInfo.relativePath,
			kind: ReflectionKind.Module
		})
	}

	return identifier(id)
}

function generateIdChainForDeclaration(node: ts.Node, ctx: Context, isParent: boolean): Identifier {
	let id = [] as IdentifierSegment[]
	let keywords = undefined as string[] | undefined

	const parent = node.parent
	if (parent) {
		id.push(...generateIdChainForDeclaration(parent, ctx, true).segments)
		if (ts.isIntersectionTypeNode(parent) || ts.isUnionTypeNode(parent)) {
			;(keywords = keywords || []).push(parent.types.indexOf(node as ts.TypeNode).toString())
		}
	}

	if (ts.isSourceFile(node)) {
		let symbol = ctx.checker.getSymbolAtLocation(node)
		symbol = symbol && ctx.checker.getMergedSymbol(symbol)
		// !!symbol check is true for ES6 modules and false for ambient declarations
		id.push(...generateIdForSourceFile(node.getSourceFile(), ctx, !!symbol).segments)
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

		id.push({
			kind: ReflectionKind.Method,
			name: name,
			keywords
		})
	} else if (ts.isTypeParameterDeclaration(node)) {
		id.push({
			kind: ReflectionKind.TypeParameter,
			name: node.name.getText(),
			keywords
		})
	} else if (ts.isPropertyDeclaration(node) || ts.isPropertyAssignment(node)) {
		if (isStatic(node)) {
			;(keywords = keywords || []).push('static')
		}

		id.push({
			kind: ReflectionKind.Property,
			name: node.name.getText(),
			keywords
		})
	} else if (ts.isModuleBlock(node)) {
		// skip
	} else if (ts.isUnionTypeNode(node)) {
		id.push({
			kind: ReflectionKind.UnionType,
			name: 'union'
		})
	} else if (ts.isIntersectionTypeNode(node)) {
		id.push({
			kind: ReflectionKind.IntersectionType,
			name: 'intersection'
		})
	} else if (ts.isModuleDeclaration(node)) {
		id.push({
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
			id.push({
				kind,
				name: symbol.escapedName.toString(),
				keywords
			})
		} else {
			let name = ((node as any) as { name?: ts.Identifier }).name
			if (name && name.text) {
				id.push({
					kind: ReflectionKind.NotSupported,
					name: name.text
				})
			} else if (
				node.kind === ts.SyntaxKind.VariableStatement ||
				node.kind === ts.SyntaxKind.VariableDeclarationList
			) {
				// just ignore
			} else {
				id.push({
					kind: ReflectionKind.NotSupported,
					name: '__type'
				})
			}
		}
	}

	return identifier(id)
}
