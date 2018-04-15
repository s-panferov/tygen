import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	BaseReflection,
	ReflectionWithExports,
	ReflectionLink,
	createLink
} from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { symbolId } from './identifier'

export interface ModuleReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.Module
	name: string
}

export function visitModule(symbol: ts.Symbol, ctx: Context): ModuleReflection {
	let moduleRef: ModuleReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Module,
		name: symbol.name
	}

	ctx.register(symbol, moduleRef)

	visitContainer(symbol, moduleRef, ctx)
	return moduleRef
}

export function visitContainer(symbol: ts.Symbol, parent: ReflectionWithExports, ctx: Context) {
	let exp = symbol.exports
	if (exp) {
		exp.forEach(item => {
			let reflection = visitSymbol(item, ctx)
			if (reflection) {
				if (!parent.exports) {
					parent.exports = []
				}
				parent.exports.push(createLink(reflection))
			}
		})
	}

	return module
}
