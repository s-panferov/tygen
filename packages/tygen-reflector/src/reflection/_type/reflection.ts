import {
	BaseReflection,
	ReflectionKind,
	ReflectionLink,
	NotIncludedReflection
} from '../reflection'

export enum TypeKind {
	Substitution = 'Substitution',
	Index = 'Index',
	Conditional = 'Conditional',
	Mapped = 'Mapped',
	Any = 'Any',
	Undefined = 'Undefined',
	Boolean = 'Boolean',
	TypeParameter = 'TypeParameter',
	TypeReference = 'TypeReference',
	Never = 'Never',
	Null = 'Null',
	Intersection = 'Intersection',
	Union = 'Union',
	Number = 'Number',
	String = 'String',
	Void = 'Void',
	Link = 'Link',
	Literal = 'Literal',
	Object = 'Object',
	ObjectLiteral = 'ObjectLiteral',
	ESSymbol = 'ESSymbol',
	IndexedAccess = 'IndexedAccess',
	Tuple = 'Tuple',
	This = 'This',
	NotSupported = 'NotSupported'
}

export interface TypeReflectionBase extends BaseReflection {
	kind: ReflectionKind.Type
	typeKind: TypeKind
}

export interface NotSupportedTypeReflection extends TypeReflectionBase {
	kind: ReflectionKind.Type
	typeKind: TypeKind.NotSupported
}

export interface PrimitiveTypeReflection extends TypeReflectionBase {
	typeKind:
		| TypeKind.Any
		| TypeKind.Boolean
		| TypeKind.Never
		| TypeKind.Null
		| TypeKind.Number
		| TypeKind.String
		| TypeKind.Void
		| TypeKind.Undefined
		| TypeKind.Object
}

import { ConditionalTypeReflection } from './conditional/reflection'
import { IndexTypeReflection } from './index-type/reflection'
import { IndexedAccessReflection } from './indexed-access/reflection'
import { IntersectionTypeReflection, UnionTypeReflection } from './intersection/reflection'
import { LiteralTypeReflection } from './literal/reflection'
import { MappedTypeReflection } from './mapped/reflection'
import { ObjectTypeReflection } from './object/reflection'
import { TypeReferenceReflection } from './reference/reflection'
import { SubstitutionTypeReflection } from './substitution/reflection'
import { ESSymbolReflection } from './symbol/reflection'
import { TupleReflection } from './tuple/reflection'
import { ThisReflection } from './this/reflection'
import { TypeParameterReflection } from '../type-parameter/reflection'

export * from './conditional/reflection'
export * from './index-type/reflection'
export * from './indexed-access/reflection'
export * from './intersection/reflection'
export * from './literal/reflection'
export * from './mapped/reflection'
export * from './object/reflection'
export * from './reference/reflection'
export * from './substitution/reflection'
export * from './symbol/reflection'
export * from './tuple/reflection'
export * from './this/reflection'
export * from '../type-parameter/reflection'

export type TypeReflection =
	| ReflectionLink
	| ConditionalTypeReflection
	| IndexTypeReflection
	| IntersectionTypeReflection
	| UnionTypeReflection
	| LiteralTypeReflection
	| MappedTypeReflection
	| ObjectTypeReflection
	| TypeReferenceReflection
	| SubstitutionTypeReflection
	| ESSymbolReflection
	| TupleReflection
	| PrimitiveTypeReflection
	| TypeParameterReflection
	| IndexedAccessReflection
	| ThisReflection
	| NotIncludedReflection
	| NotSupportedTypeReflection
