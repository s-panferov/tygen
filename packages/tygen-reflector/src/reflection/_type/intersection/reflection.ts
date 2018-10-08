import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface IntersectionTypeReflection extends BaseReflection {
	kind: ReflectionKind.IntersectionType
	types: TypeReflection[]
}

export interface UnionTypeReflection extends BaseReflection {
	kind: ReflectionKind.UnionType
	types: TypeReflection[]
}
