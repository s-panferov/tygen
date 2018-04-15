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

export interface ReflectionWithTypeParameters {
	typeParameters?: TypeParameterReflection[]
}

export interface ReflectionWithHeritageClauses {
	heritageClauses?: HeritageClauseReflection[]
}

export interface ReflectionWithBaseTypes {
	baseTypes?: TypeReflection[]
}

export interface InterfaceReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithHeritageClauses,
		ReflectionWithCallSignatures,
		ReflectionWithBaseTypes {
	kind: ReflectionKind.Interface
	name: string
}

export interface HeritageClauseReflection {
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
	visitCallSignatures(type, iface, ctx)
	visitObjectLikeReflection(symbol, type, iface, ctx)

	return iface
}

export interface ObjectLikeReflection
	extends ReflectionWithConstructSignatures,
		ReflectionWithIndexSignatures,
		ReflectionWithProperties {}

export function visitObjectLikeReflection(
	symbol: ts.Symbol,
	type: ts.Type,
	parent: ObjectLikeReflection,
	ctx: Context
) {
	visitObjectProperties(symbol, type, parent, ctx)
	visitConstructSignatures(type, parent, ctx)
	visitIndexSignatures(type, parent, ctx)
}

export function visitBaseTypes(
	symbol: ts.Symbol,
	type: ts.Type,
	parent: ReflectionWithBaseTypes,
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
