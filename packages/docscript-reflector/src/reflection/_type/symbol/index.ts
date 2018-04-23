import * as ts from 'typescript'

import { TypeKind } from '../reflection'
import { ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { ESSymbolReflection } from './reflection'

export function visitESSymbol(type: ts.UniqueESSymbolType, ctx: Context): ESSymbolReflection {
	let reflection: ESSymbolReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.ESSymbol
	}

	ctx.registerType(type, reflection)

	return reflection
}
