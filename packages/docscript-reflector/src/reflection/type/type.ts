import * as ts from 'typescript'
import { visitPrimitive } from './primitive'
import { visitSymbol } from '../visitor'
import { Context } from '../../context'
import { ReflectionKind, ReflectionLink, BaseReflection } from '../reflection'
import { visitLiteral, visitBooleanLiteral } from './literal'
import { visitUnion, visitIntersection } from './intersection'
import { visitTypeLiteral } from './type-literal'
import { visitESSymbol } from './symbol'
import { visitIndexedAccess } from './indexed-access'

export enum TypeKind {
	Unsupported = 'Unsupported',
	Any = 'Any',
	Boolean = 'Boolean',
	Never = 'Never',
	Null = 'Null',
	Intersection = 'Intersection',
	Union = 'Union',
	Number = 'Number',
	String = 'String',
	Void = 'Void',
	Link = 'Link',
	Unreachable = 'Unreachable',
	Literal = 'Literal',
	Object = 'Object',
	TypeLiteral = 'TypeLiteral',
	ESSymbol = 'ESSymbol',
	IndexedAccess = 'IndexedAccess'
}

export interface TypeReflectionBase extends BaseReflection {
	kind: ReflectionKind.Type
	typeKind: TypeKind
}

export type TypeReflection = ReflectionLink | TypeReflectionBase

export function visitType(type: ts.Type, ctx: Context): TypeReflection {
	let primitive = visitPrimitive(type)
	if (primitive) {
		return primitive
	}

	let symbol = type.getSymbol()
	if (symbol) {
		if (symbol.flags & ts.SymbolFlags.TypeLiteral) {
			return visitTypeLiteral(type, ctx)
		}

		let reflection = visitSymbol(symbol, ctx)
		if (reflection) {
			if (reflection.id) {
				return {
					kind: ReflectionKind.Link,
					target: reflection.id
				}
			} else {
				debugger
				return {
					kind: ReflectionKind.Type,
					typeKind: TypeKind.Unreachable
				}
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
	}

	debugger

	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Unsupported
	}
}
