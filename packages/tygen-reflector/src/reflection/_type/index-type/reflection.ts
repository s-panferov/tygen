import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface IndexTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Index
	type: TypeReflection
}
