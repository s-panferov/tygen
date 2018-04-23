import * as ts from 'typescript'
import { Context } from '../context'

export function symbolId(symbol: ts.Symbol, ctx: Context): string {
	return generateIdChainForSymbol(symbol, ctx).join('::')
}

export function declarationId(node: ts.Node, ctx: Context): string {
	return generateIdChainForDeclaration(node, ctx).join('::')
}

function generateIdChainForSymbol(symbol: ts.Symbol, ctx: Context): string[] {
	let id = [] as string[]

	if (!symbol) {
		debugger
		throw new Error('WAT?')
	}

	let declarations = symbol.declarations
	if (declarations && declarations.length > 0) {
		let node = declarations[0]!
		return generateIdChainForDeclaration(node, ctx)
	} else {
		let parent = (symbol as any).parent
		if (parent) {
			id.push(...generateIdChainForSymbol(parent, ctx))
		}

		if (symbol.name) {
			id.push(symbol.name)
		} else {
			id.push('__type')
		}
	}

	return id
}

function isStatic(node: ts.Node) {
	return ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static
}

function generateIdChainForDeclaration(
	node: ts.Node,
	ctx: Context,
	_symbolName?: string
): string[] {
	let id = [] as string[]

	const parent = node.parent
	if (parent) {
		id.push(...generateIdChainForDeclaration(parent, ctx))
		if (ts.isIntersectionTypeNode(parent) || ts.isUnionTypeNode(parent)) {
			id.push(parent.types.indexOf(node as ts.TypeNode).toString())
		}
	}

	if (ts.isSourceFile(node)) {
		let fileName = node.getSourceFile().fileName
		let module = ctx.generator.getModule(fileName)!

		id.push(module.pkg.manifest.name)
		id.push(module.pkg.manifest.version)
		id.push(module.pathInfo.relativePath)
	} else if (ts.isMethodDeclaration(node)) {
		id.push((isStatic(node) ? '.' : '') + node.name.getText())
	} else if (
		ts.isMethodSignature(node) ||
		ts.isFunctionDeclaration(node) ||
		ts.isCallSignatureDeclaration(node) ||
		ts.isConstructSignatureDeclaration(node)
	) {
		let symbol: ts.Symbol | undefined =
			(node as any).symbol || ctx.checker.getSymbolAtLocation(node)

		let name = node.name ? node.name.getText() : symbol ? symbol.name : '__function'
		if (symbol && symbol.declarations && symbol.declarations.length > 1) {
			id.push((isStatic(node) ? '.' : '') + `${name}.${symbol.declarations.indexOf(node)}`)
		} else {
			id.push((isStatic(node) ? '.' : '') + name)
		}
	} else if (ts.isTypeParameterDeclaration(node)) {
		id.push(`<${node.name.getText()}>`)
	} else if (ts.isPropertyDeclaration(node)) {
		id.push(`.${node.name.getText()}`)
	} else if (ts.isUnionTypeNode(node)) {
		id.push('__union__')
	} else if (ts.isIntersectionTypeNode(node)) {
		id.push('__intersection__')
	} else {
		let name = ((node as any) as { name?: ts.Identifier }).name
		if (name && name.text) {
			id.push(name.text)
		} else if (
			node.kind === ts.SyntaxKind.VariableStatement ||
			node.kind === ts.SyntaxKind.VariableDeclarationList
		) {
			// just ignore
		} else {
			let symbol: ts.Symbol | undefined =
				(node as any).symbol || ctx.checker.getSymbolAtLocation(node)

			if (symbol && symbol.name) {
				id.push(symbol.name)
			} else {
				id.push('__type')
			}
		}
	}

	return id
}
