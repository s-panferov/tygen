import ts from 'typescript'

import { Context } from '../../context'
import { visitContainer } from '../module'
import { symbolId } from '../identifier'
import { visitBaseTypes, visitObjectLikeReflection } from '../interface'
import { ClassReflection } from './reflection'
import { ReflectionKind } from '../reflection'

export function visitClass(symbol: ts.Symbol, ctx: Context): ClassReflection {
	let classRef: ClassReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Class,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, classRef)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol)

	visitContainer(symbol, classRef, ctx)
	visitBaseTypes(type, classRef, ctx)
	visitObjectLikeReflection(type, classRef, ctx)

	// TODO visit "implements"

	return classRef
}
