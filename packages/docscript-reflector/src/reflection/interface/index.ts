import ts from 'typescript'

import { ReflectionKind } from '../reflection'

import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { visitTypeParameter } from '../type-parameter'
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
	// let ifaceType = type as ts.InterfaceTypeWithDeclaredMembers
	// if (ifaceType.declaredProperties) {
	// 	ifaceType.declaredProperties.forEach(property => {
	// 		let reflection = visitSymbol(property, ctx) as PropertyReflection
	// 		if (!reflection) {
	// 			return
	// 		}

	// 		if (!parent.ownProperties) {
	// 			parent.ownProperties = []
	// 		}

	// 		parent.ownProperties.push(reflection)
	// 	})
	// }

	let properties = type.getProperties()
	properties.forEach(property => {
		let reflection = visitSymbol(property, ctx) as PropertyReflection
		if (!reflection) {
			return
		}

		if (!parent.allProperties) {
			parent.allProperties = []
		}

		parent.allProperties.push(reflection)
	})
}
