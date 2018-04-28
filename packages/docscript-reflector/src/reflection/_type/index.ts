import * as ts from 'typescript'
import { visitPrimitive } from './primitive'
import { visitSymbol } from '../visitor'
import { Context } from '../../context'
import { ReflectionKind, ReflectionLink } from '../reflection'
import { visitLiteral, visitBooleanLiteral } from './literal'
import { visitUnion, visitIntersection } from './intersection'
import { visitESSymbol } from './symbol'
import { visitIndexedAccess } from './indexed-access'
import { visitReference } from './reference'
import { visitObjectLiteral } from './object'
import { visitTypeParameter } from '../type-parameter'
import { visitTuple } from './tuple'
import { visitConditional } from './conditional'
import { visitMapped } from './mapped'
import { visitIndexType } from './index-type'
import { visitSubstitution } from './substitution'
import { TypeReflection, TypeKind, NotSupportedTypeReflection } from './reflection'

export function visitType(type: ts.Type, ctx: Context): TypeReflection {
	let existed = ctx.reflectionByType.get(type)
	if (existed) {
		return existed
	}

	let reflection = visitTypeInternal(type, ctx)
	if (!ctx.reflectionByType.get(type)) {
		throw new Error('Reflection is not registered')
	}

	return reflection
}

function visitTypeInternal(type: ts.Type, ctx: Context): TypeReflection {
	let primitive = visitPrimitive(type, ctx)
	if (primitive) {
		return primitive
	}

	if (type.flags & ts.TypeFlags.Object) {
		let objectType = type as ts.ObjectType
		// Visit only exact reference to prevent cycle types
		if (objectType.objectFlags === ts.ObjectFlags.Reference) {
			let reference = objectType as ts.TypeReference
			if (reference.target.objectFlags & ts.ObjectFlags.Tuple) {
				return visitTuple(reference, ctx)
			} else {
				let referenceType = objectType as ts.TypeReference
				return visitReference(referenceType, ctx)
			}
		} else if (objectType.objectFlags & ts.ObjectFlags.Mapped) {
			return visitMapped(type, ctx)
		} else if (!(objectType.objectFlags & ts.ObjectFlags.ClassOrInterface)) {
			return visitObjectLiteral(type, ctx)
		}
	}

	if (type.flags & ts.TypeFlags.Conditional) {
		return visitConditional(type as ts.ConditionalType, ctx)
	}

	if (type.flags & ts.TypeFlags.Index) {
		return visitIndexType(type as ts.IndexType, ctx)
	}

	if (type.flags & ts.TypeFlags.TypeParameter) {
		return visitTypeParameter(type, ctx)
	}

	if (type.flags & ts.TypeFlags.Substitution) {
		return visitSubstitution(type as ts.SubstitutionType, ctx)
	}

	let symbol = type.getSymbol()
	if (symbol) {
		let reflection = visitSymbol(symbol, ctx, type)
		if (reflection) {
			if (reflection.id) {
				let link: ReflectionLink = {
					kind: ReflectionKind.Link,
					target: reflection.id,
					targetKind: reflection.kind
				}

				ctx.registerType(type, link)
				return link
			} else {
				debugger
				throw new Error('Unreachable')
			}
		} else {
			debugger
		}
	}

	if (type.flags & ts.TypeFlags.StringOrNumberLiteral) {
		return visitLiteral(type as ts.LiteralType, ctx)
	} else if (type.flags & ts.TypeFlags.BooleanLiteral) {
		return visitBooleanLiteral(type, ctx)
	} else if (type.flags & ts.TypeFlags.Union) {
		return visitUnion(type as ts.UnionType, ctx)
	} else if (type.flags & ts.TypeFlags.Intersection) {
		return visitIntersection(type as ts.IntersectionType, ctx)
	} else if (type.flags & ts.TypeFlags.ESSymbol) {
		return visitESSymbol(type as ts.UniqueESSymbolType, ctx)
	} else if (type.flags & ts.TypeFlags.IndexedAccess) {
		return visitIndexedAccess(type as ts.IndexedAccessType, ctx)
	} else if (type.flags & ts.TypeFlags.Object) {
		let objectType = type as ts.ObjectType
		if (objectType.objectFlags & ts.ObjectFlags.Reference) {
			return visitReference(type as ts.TypeReference, ctx)
		}
	}

	debugger

	let reflection: NotSupportedTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.NotSupported
	}

	ctx.registerType(type, reflection)
	return reflection
}
