import * as ts from 'typescript'
import { Context } from '../context'

export function symbolId(symbol: ts.Symbol, ctx: Context): string {
	return generateIdChainForSymbol(symbol, ctx).join('/')
}

export function declarationId(node: ts.Node, ctx: Context): string {
	return generateIdChainForDeclaration(node, ctx).join('/')
}

function generateIdChainForSymbol(symbol: ts.Symbol, ctx: Context): string[] {
	let id = [] as string[]

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
		}
	}

	return []
}

function generateIdChainForDeclaration(node: ts.Node, ctx: Context): string[] {
	let id = [] as string[]

	if (node.parent) {
		id.push(...generateIdChainForDeclaration(node.parent, ctx))
	}

	if (ts.isSourceFile(node)) {
		let fileName = node.getSourceFile().fileName
		let module = ctx.generator.getModule(fileName)!

		id.push(module.pkg.manifest.name)
		id.push(module.pkg.manifest.version)
		id.push(module.pathInfo.relativePath)
	} else {
		let name = ((node as any) as { name?: ts.Identifier }).name
		if (name) {
			id.push(name.text)
		} else if (
			node.kind === ts.SyntaxKind.VariableStatement ||
			node.kind === ts.SyntaxKind.VariableDeclarationList
		) {
		} else {
		}
	}

	return id
}
