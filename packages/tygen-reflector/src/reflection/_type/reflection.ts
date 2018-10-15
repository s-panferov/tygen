import {
	BaseReflection,
	ReflectionKind,
	ReflectionLink,
	NotIncludedReflection,
	NotSupportedReflection
} from '../reflection'

export interface PrimitiveTypeReflection extends BaseReflection {
	kind:
		| ReflectionKind.AnyType
		| ReflectionKind.BooleanType
		| ReflectionKind.NeverType
		| ReflectionKind.NullType
		| ReflectionKind.NumberType
		| ReflectionKind.StringType
		| ReflectionKind.VoidType
		| ReflectionKind.UndefinedType
		| ReflectionKind.ObjectType
		| ReflectionKind.UnknownType
}

import { ConditionalTypeReflection } from './conditional/reflection'
import { IndexTypeReflection } from './index-type/reflection'
import { IndexedAccessReflection } from './indexed-access/reflection'
import { IntersectionTypeReflection, UnionTypeReflection } from './intersection/reflection'
import { LiteralTypeReflection } from './literal/reflection'
import { MappedTypeReflection } from './mapped/reflection'
import { ObjectTypeReflection } from './object/reflection'
import { TypeReferenceReflection } from './reference/reflection'
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
	| ESSymbolReflection
	| TupleReflection
	| PrimitiveTypeReflection
	| TypeParameterReflection
	| IndexedAccessReflection
	| ThisReflection
	| NotIncludedReflection
	| NotSupportedReflection
