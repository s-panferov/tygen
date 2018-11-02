import ts from 'typescript'

import { ReflectionKind } from '../reflection'

import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { visitContainer } from '../module'
import { visitType } from '../_type'
import { visitCallSignatures, visitConstructSignatures, visitIndexSignatures } from '../signature'

import { symbolId } from '../identifier'
import { PropertyReflection } from '../property/reflection'

import {
	ReflectionWithBaseTypes,
	ReflectionWithTypeParameters,
	ObjectLikeReflection,
	InterfaceReflection,
	ReflectionWithProperties
} from './reflection'
import { MethodReflection } from '../function/reflection'
import { TypeParameterReflection } from '../_type/reflection'

export function visitInterface(symbol: ts.Symbol, ctx: Context): InterfaceReflection {
	let iface: InterfaceReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Interface,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, iface)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol) as ts.InterfaceType

	visitContainer(symbol, iface, ctx)

	visitTypeParameters(type.typeParameters, iface, ctx)
	visitBaseTypes(type, iface, ctx)
	visitCallSignatures(type, iface, ctx)
	visitObjectLikeReflection(type, iface, ctx)

	return iface
}

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
			if (!parent.extends) {
				parent.extends = []
			}
			parent.extends.push(reflection)
		})
	}
}

export function visitTypeParameters(
	typeParameters: ReadonlyArray<ts.TypeParameter> | undefined,
	parent: ReflectionWithTypeParameters,
	ctx: Context
) {
	if (typeParameters) {
		typeParameters.forEach(ty => {
			if (!parent.typeParameters) {
				parent.typeParameters = []
			}
			// visitSymbol instead of visitType because we dont want a reference
			parent.typeParameters.push(visitSymbol(ty.symbol, ctx) as TypeParameterReflection)
		})
	}
}

export function visitObjectProperties(
	type: ts.Type,
	parent: ReflectionWithProperties,
	ctx: Context
) {
	const properties = type.getProperties()

	properties.forEach(property => {
		const reflection = visitSymbol(property, ctx) as PropertyReflection | MethodReflection

		if (!reflection) {
			return
		}

		if (!parent.properties) {
			parent.properties = []
		}

		parent.properties.push(reflection)
	})
}
