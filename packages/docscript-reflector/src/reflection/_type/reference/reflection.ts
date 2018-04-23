import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface TypeReferenceReflection extends TypeReflectionBase {
	typeKind: TypeKind.TypeReference
	target: TypeReflection
	typeArguments?: TypeReflection[]
}
