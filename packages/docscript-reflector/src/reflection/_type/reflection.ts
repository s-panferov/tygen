import { BaseReflection, ReflectionKind, ReflectionLink } from '../reflection'

export enum TypeKind {
	Unsupported = 'Unsupported',
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
	Unreachable = 'Unreachable',
	Literal = 'Literal',
	Object = 'Object',
	ObjectLiteral = 'ObjectLiteral',
	ESSymbol = 'ESSymbol',
	IndexedAccess = 'IndexedAccess',
	Tuple = 'Tuple'
}

export interface TypeReflectionBase extends BaseReflection {
	kind: ReflectionKind.Type
	typeKind: TypeKind
}

import { ConditionalTypeReflection } from './conditional/reflection'
import { IndexTypeReflection } from './index-type/reflection'
import { IntersectionTypeReflection, UnionTypeReflection } from './intersection/reflection'
import { LiteralTypeReflection } from './literal/reflection'
import { MappedTypeReflection } from './mapped/reflection'
import { ObjectTypeReflection } from './object/reflection'
import { TypeReferenceReflection } from './reference/reflection'
import { SubstitutionTypeReflection } from './substitution/reflection'
import { ESSymbolReflection } from './symbol/reflection'
import { TupleReflection } from './tuple/reflection'

export interface PrimitiveTypeReflection extends TypeReflectionBase {
	typeKind:
		| TypeKind.Any
		| TypeKind.Boolean
		| TypeKind.Never
		| TypeKind.Null
		| TypeKind.Number
		| TypeKind.String
		| TypeKind.Void
}

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
