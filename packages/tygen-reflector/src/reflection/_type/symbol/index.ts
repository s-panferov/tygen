import * as ts from 'typescript'

import { Context } from '../../../context'
import { ESSymbolReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitESSymbol(type: ts.UniqueESSymbolType, ctx: Context): ESSymbolReflection {
	let reflection: ESSymbolReflection = {
		kind: ReflectionKind.ESSymbolType
	}

	ctx.registerType(type, reflection)

	return reflection
}
