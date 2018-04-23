import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface IntersectionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Intersection
	types: TypeReflection[]
}
