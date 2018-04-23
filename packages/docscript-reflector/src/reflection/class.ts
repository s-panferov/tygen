import ts from 'typescript'

import { ReflectionKind, ReflectionWithExports, BaseReflection } from './reflection'

import { Context } from '../context'
import { visitContainer } from './module'
import { symbolId } from './identifier'
import {
	ReflectionWithTypeParameters,
	ReflectionWithBaseTypes,
	visitBaseTypes,
	visitObjectLikeReflection,
	ObjectLikeReflection
} from './interface'

export interface ClassReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithBaseTypes {
	kind: ReflectionKind.Class
	name: string
}

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
