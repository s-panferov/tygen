import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface ESSymbolReflection extends TypeReflectionBase {
	typeKind: TypeKind.ESSymbol
}

export function visitESSymbol(type: ts.UniqueESSymbolType, ctx: Context): ESSymbolReflection {
	let reflection: ESSymbolReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.ESSymbol
	}

	ctx.registerType(type, reflection)

	return reflection
}
