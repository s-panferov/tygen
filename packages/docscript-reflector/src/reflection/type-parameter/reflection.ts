import { TypeReflectionBase, TypeKind } from '../_type/reflection'
import { ReflectionKind } from '../reflection'

export interface TypeParameterReflection extends TypeReflectionBase {
	name: string
	kind: ReflectionKind.Type
	typeKind: TypeKind.TypeParameter
	constraint?: never
	default?: never
	expression?: never
}
