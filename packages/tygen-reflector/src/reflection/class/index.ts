import ts from 'typescript'

import { Context } from '../../context'
import { visitContainer } from '../module'
import { symbolId } from '../identifier'
import { visitBaseTypes, visitObjectLikeReflection } from '../interface'
import { ClassReflection } from './reflection'
import { ReflectionKind, Reflection } from '../reflection'
import { visitType } from '../_type'

export function visitClass(symbol: ts.Symbol, ctx: Context): ClassReflection {
	let classRef: ClassReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Class,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, classRef)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol)

	visitImplements(symbol, classRef, ctx)
	visitContainer(symbol, classRef, ctx)
	visitBaseTypes(type, classRef, ctx)
	visitObjectLikeReflection(type, classRef, ctx)

	// TODO visit "implements"

	return classRef
}

function visitImplements(
	symbol: ts.Symbol,
	parent: ClassReflection,
	ctx: Context
): Reflection[] | undefined {
	if (!symbol.declarations || !symbol.declarations[0]) {
		return
	}

	const klass = symbol.declarations[0]

	if (!ts.isClassDeclaration(klass)) {
		return
	}

	if (!klass.heritageClauses) {
		return
	}

	const impl: Reflection[] = []

	klass.heritageClauses.forEach(clause => {
		if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
			return clause.types.forEach(_type => {
				const type = ctx.checker.getTypeAtLocation(_type)
				impl.push(visitType(type, ctx))
			})
		}
	})

	if (impl.length > 0) {
		parent.implements = impl
	}
}
