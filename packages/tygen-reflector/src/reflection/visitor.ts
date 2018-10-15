import * as ts from 'typescript'

import { Context } from '../context'
import { visitInterface } from './interface'
import { visitProperty } from './property'
import { visitModule } from './module'

import { Reflection, ReflectionKind } from './reflection'
import { visitEnum, visitEnumMember } from './enum'
import { visitFunction, visitMethod } from './function'
import { visitClass } from './class'
import { visitTypeAlias } from './type-alias'
import { visitVariable, isParameter } from './variable'
import { generateIdForSourceFile, idFromPath } from './identifier'
import { visitTypeParameter } from './type-parameter'

export function visitSymbol(symbol: ts.Symbol, ctx: Context): Reflection | undefined {
	if (symbol.flags & ts.SymbolFlags.Alias) {
		symbol = ctx.checker.getAliasedSymbol(symbol)
	}

	symbol = ctx.checker.getMergedSymbol(symbol)

	if (ctx.visitedReflections.has(symbol)) {
		return ctx.reflectionBySymbol.get(symbol)
	}

	ctx.visitedReflections.add(symbol)

	let reflection: Reflection | undefined

	switch (symbolToKnownReflectionKind(symbol)) {
		case ReflectionKind.Module:
			reflection = visitModule(symbol, ctx)
			break
		case ReflectionKind.Variable:
			reflection = visitVariable(symbol, ctx)
			break
		case ReflectionKind.Enum:
			reflection = visitEnum(symbol, ctx)
			break
		case ReflectionKind.Class:
			reflection = visitClass(symbol, ctx)
			break
		case ReflectionKind.EnumMember:
			reflection = visitEnumMember(symbol, ctx)
			break
		case ReflectionKind.Interface:
			reflection = visitInterface(symbol, ctx)
			break
		case ReflectionKind.Method:
			reflection = visitMethod(symbol, ctx)
			break
		case ReflectionKind.Property:
			reflection = visitProperty(symbol, ctx)
			break
		case ReflectionKind.Function:
			reflection = visitFunction(symbol, ctx)
			break
		case ReflectionKind.TypeAlias:
			reflection = visitTypeAlias(symbol, ctx)
			break
		case ReflectionKind.TypeParameter:
			reflection = visitTypeParameter(symbol, ctx)
			break
		case ReflectionKind.Variable:
		case ReflectionKind.Parameter:
			reflection = visitVariable(symbol, ctx)
			break
		default:
			if (
				(symbol.flags & ts.SymbolFlags.ExportStar) |
				(symbol.flags & ts.SymbolFlags.ExportValue) |
				(symbol.flags & ts.SymbolFlags.Alias)
			) {
				// just ignore
			} else {
				debugger
				throw new Error('Unknown symbol')
			}
	}

	if (reflection) {
		let comment = symbol.getDocumentationComment(ctx.checker)

		if (comment.length > 0) {
			reflection.comments = comment
		}

		let tags = symbol.getJsDocTags()
		if (tags.length > 0) {
			reflection.tags = tags
		}

		if (symbol.declarations && symbol.declarations.length) {
			reflection.definedIn = symbol.declarations.map(decl => {
				const sourceId = generateIdForSourceFile(decl.getSourceFile(), ctx)
				return {
					source: idFromPath(sourceId),
					start: decl.getStart(undefined, true),
					end: decl.getEnd()
				}
			})
		}
	}

	if (reflection && !ctx.reflectionBySymbol.get(symbol)) {
		debugger
		throw new Error('Symbol reflection was not registered')
	}

	if (!reflection) {
		debugger
	}

	return reflection
}

export function symbolToKnownReflectionKind(symbol: ts.Symbol): ReflectionKind | undefined {
	if (symbol.flags & ts.SymbolFlags.Module) {
		return ReflectionKind.Module
	} else if (symbol.flags & ts.SymbolFlags.Alias) {
		return ReflectionKind.Variable
	} else if (symbol.flags & ts.SymbolFlags.Enum) {
		return ReflectionKind.Enum
	} else if (symbol.flags & ts.SymbolFlags.Class) {
		return ReflectionKind.Class
	} else if (symbol.flags & ts.SymbolFlags.EnumMember) {
		return ReflectionKind.EnumMember
	} else if (symbol.flags & ts.SymbolFlags.Interface) {
		return ReflectionKind.Interface
	} else if (symbol.flags & ts.SymbolFlags.Method) {
		return ReflectionKind.Method
	} else if (symbol.flags & ts.SymbolFlags.Property || symbol.flags & ts.SymbolFlags.Accessor) {
		return ReflectionKind.Property
	} else if (symbol.flags & ts.SymbolFlags.Function) {
		return ReflectionKind.Function
	} else if (symbol.flags & ts.SymbolFlags.TypeAlias) {
		return ReflectionKind.TypeAlias
	} else if (symbol.flags & ts.SymbolFlags.Signature) {
		return ReflectionKind.Signature
	} else if (symbol.flags & ts.SymbolFlags.TypeParameter) {
		return ReflectionKind.TypeParameter
	} else if (symbol.flags & ts.SymbolFlags.Variable) {
		if (isParameter(symbol)) {
			return ReflectionKind.Parameter
		} else {
			return ReflectionKind.Variable
		}
	} else if (symbol.flags & ts.SymbolFlags.TypeLiteral) {
		return ReflectionKind.LiteralType
	}

	return undefined
}
