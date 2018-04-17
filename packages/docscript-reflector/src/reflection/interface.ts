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
import { TypeParameterReflection, visitTypeParameter } from './type-parameter'
import { visitContainer } from './module'
import { isReachable } from './utils'
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

export interface ExpressionWithTypeArgumentsReflection {}

export function visitInterface(symbol: ts.Symbol, ctx: Context): InterfaceReflection {
	let iface: InterfaceReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Interface,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, iface)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol) as ts.InterfaceType

	visitContainer(symbol, iface, ctx)

	visitTypeParameters(type, iface, ctx)
	visitBaseTypes(type, iface, ctx)
	visitCallSignatures(type, iface, ctx)
	visitObjectLikeReflection(type, iface, ctx)

	return iface
}

export interface ObjectLikeReflection
	extends ReflectionWithConstructSignatures,
		ReflectionWithIndexSignatures,
		ReflectionWithProperties {}

export function visitObjectLikeReflection(
	type: ts.Type,
	parent: ObjectLikeReflection,
	ctx: Context
) {
	visitObjectProperties(type, parent, ctx)
	visitConstructSignatures(type, parent, ctx)
	visitIndexSignatures(type, parent, ctx)
}

export function visitBaseTypes(type: ts.Type, parent: ReflectionWithBaseTypes, ctx: Context) {
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

export function visitTypeParameters(
	type: ts.InterfaceType,
	parent: ReflectionWithTypeParameters,
	ctx: Context
) {
	let typeParameters = type.typeParameters
	if (typeParameters) {
		typeParameters.forEach(ty => {
			if (!parent.typeParameters) {
				parent.typeParameters = []
			}
			parent.typeParameters.push(visitTypeParameter(ty, ctx))
		})
	}
}

export function visitObjectProperties(
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
