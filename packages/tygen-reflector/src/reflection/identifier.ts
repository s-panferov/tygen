import * as ts from 'typescript'
import { Context } from '../context'
import { isParameter } from './variable'

export function symbolId(symbol: ts.Symbol, ctx: Context): string {
	return generateIdChainForSymbol(symbol, ctx).join('')
}

export function declarationId(node: ts.Node, ctx: Context): string {
	return generateIdChainForDeclaration(node, ctx, false).join('')
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
		return generateIdChainForDeclaration(node, ctx, false)
	} else {
		let parent = (symbol as any).parent
		if (parent) {
			id.push(...generateIdChainForSymbol(parent, ctx))
		}

		if (symbol.name) {
			id.push(isWritableSymbol(symbol) ? '->' : '::', symbol.name)
		} else {
			id.push('::', '__type')
		}
	}

	return id
}

function isStatic(node: ts.Declaration) {
	return ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static
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
): string[] {
	let id = [] as string[]

	const fileName = sourceFile.fileName
	const module = ctx.generator.getFile(fileName)!
	id.push(module.pkg.manifest.name)
	id.push('->', module.pkg.manifest.version)

	if (addFilePath) {
		id.push('->', module.pathInfo.relativePath)
	}

	return id
}

function generateIdChainForDeclaration(node: ts.Node, ctx: Context, isParent: boolean): string[] {
	let id = [] as string[]

	const parent = node.parent
	if (parent) {
		id.push(...generateIdChainForDeclaration(parent, ctx, true))
		if (ts.isIntersectionTypeNode(parent) || ts.isUnionTypeNode(parent)) {
			id.push(parent.types.indexOf(node as ts.TypeNode).toString())
		}
	}

	if (ts.isSourceFile(node)) {
		const symbol = ctx.checker.getSymbolAtLocation(node)
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
		const isWritable = symbol && isWritableSymbol(symbol)
		if (symbol && symbol.declarations && symbol.declarations.length > 1 && isParent) {
			id.push(
				isWritable ? '->' : '::',
				(isStatic(node) ? '.' : '') + `${name}.${symbol.declarations.indexOf(node)}`
			)
		} else {
			id.push(isWritable ? '->' : '::', (isStatic(node) ? '.' : '') + name)
		}
	} else if (ts.isTypeParameterDeclaration(node)) {
		id.push('::', `<${node.name.getText()}>`)
	} else if (ts.isPropertyDeclaration(node)) {
		id.push('::', `.${node.name.getText()}`)
	} else if (ts.isPropertyAssignment(node)) {
		id.push('::', node.name.getText())
	} else if (ts.isModuleBlock(node)) {
		// skip
	} else if (ts.isUnionTypeNode(node)) {
		id.push('::', '__union__')
	} else if (ts.isIntersectionTypeNode(node)) {
		id.push('::', '__intersection__')
	} else if (ts.isModuleDeclaration(node)) {
		id.push('->', node.name.getText().replace(/"/g, `'`))
	} else {
		let symbol: ts.Symbol | undefined =
			(node as any).symbol || ctx.checker.getSymbolAtLocation(node)

		symbol = symbol && ctx.checker.getMergedSymbol(symbol)

		if (symbol && symbol.escapedName) {
			id.push(isWritableSymbol(symbol) ? '->' : '::', symbol.escapedName.toString())
		} else {
			let name = ((node as any) as { name?: ts.Identifier }).name
			if (name && name.text) {
				id.push('::', name.text)
			} else if (
				node.kind === ts.SyntaxKind.VariableStatement ||
				node.kind === ts.SyntaxKind.VariableDeclarationList
			) {
				// just ignore
			} else {
				id.push('::', '__type')
			}
		}
	}

	return id
}
