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

export type TypeReflection = ReflectionLink | TypeReflectionBase
