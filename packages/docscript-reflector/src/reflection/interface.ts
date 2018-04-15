import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	ReflectionLink,
	HasId,
	createLink
} from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { TypeParameterReflection } from './type-parameter'
import { visitContainer } from './module'
import { isReachable } from './utils'
import { ObjectLiteralReflection } from './object'
import { TypeReflection, visitType } from './type/type'
import {
	ReflectionWithCallSignatures,
	ReflectionWithConstructSignatures,
	visitCallSignatures,
	visitConstructSignatures,
	ReflectionWithIndexSignatures,
	visitIndexSignatures
} from './signature'
import { symbolId } from './identifier'

export interface ReflectionWithProperties {
	properties?: Reflection[]
	apparentProperties?: Reflection[]
}

export interface InterfaceReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection {
	kind: ReflectionKind.Interface
	name: string
	typeParameters?: TypeParameterReflection[]
	heritageClauses?: HeritageClauseReflection[]
	baseTypes?: TypeReflection[]
}

interface HeritageClauseReflection {
	kind: ReflectionKind.HeritageClause
	token: 'extends' | 'implements'
	types: ExpressionWithTypeArgumentsReflection[]
}

interface ExpressionWithTypeArgumentsReflection {}

export function visitInterface(symbol: ts.Symbol, ctx: Context): InterfaceReflection {
	let iface: InterfaceReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Interface,
		name: symbol.name
	}

	ctx.register(symbol, iface)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)

	visitContainer(symbol, iface, ctx)
	visitBaseTypes(symbol, type, iface, ctx)
	visitObjectLikeReflection(symbol, type, iface, ctx)
	registerRelatedModules(symbol, iface, ctx)

	return iface
}

export interface ObjectLikeReflection
	extends ReflectionWithCallSignatures,
		ReflectionWithConstructSignatures,
		ReflectionWithIndexSignatures,
		ReflectionWithProperties {}

export function visitObjectLikeReflection(
	symbol: ts.Symbol,
	type: ts.Type,
	parent: ObjectLikeReflection,
	ctx: Context
) {
	visitObjectProperties(symbol, type, parent, ctx)
	visitCallSignatures(type, parent, ctx)
	visitConstructSignatures(type, parent, ctx)
	visitIndexSignatures(type, parent, ctx)
}

export function registerRelatedModules(symbol: ts.Symbol, reflection: Reflection, ctx: Context) {
	if (symbol.declarations) {
		// Push a link to our interface to all modules that declare it

		symbol.declarations.forEach(decl => {
			let sourceFile = decl.getSourceFile()
			let module = ctx.generator.getModule(sourceFile.fileName)!
			module.ensureOwnReflection(ctx)
			if (!module.reflection.exports) {
				module.reflection.exports = []
			}

			module.reflection.exports.push(createLink(reflection))
		})
	}
}

export function visitBaseTypes(
	symbol: ts.Symbol,
	type: ts.Type,
	parent: InterfaceReflection,
	ctx: Context
) {
	const baseTypes = type.getBaseTypes()
	if (baseTypes) {
		baseTypes.forEach(type => {
			const reflection = visitType(type, ctx)
			if (!parent.baseTypes) {
				parent.baseTypes = []
			}
			parent.baseTypes.push(reflection)
		})
	}
}

export function visitObjectProperties(
	symbol: ts.Symbol,
	type: ts.Type,
	parent: ReflectionWithProperties,
	ctx: Context
) {
	let properties = type.getProperties()
	properties.forEach(property => {
		let reflection = visitSymbol(property, ctx)
		if (!reflection) {
			return
		}

		if (!parent.properties) {
			parent.properties = []
		}

		parent.properties.push(createLink(reflection))
	})

	let apparentProperties = type.getApparentProperties()
	apparentProperties.forEach(property => {
		let reflection = visitSymbol(property, ctx)
		if (!reflection) {
			return
		}

		if (!parent.apparentProperties) {
			parent.apparentProperties = []
		}

		parent.apparentProperties.push(createLink(reflection))
	})
}
