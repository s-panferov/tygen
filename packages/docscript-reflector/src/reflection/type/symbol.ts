import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface ESSymbolReflection extends TypeReflectionBase {
	typeKind: TypeKind.ESSymbol
}

export function visitESSymbol(type: ts.UniqueESSymbolType, ctx: Context): ESSymbolReflection {
	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.ESSymbol
	}
}
