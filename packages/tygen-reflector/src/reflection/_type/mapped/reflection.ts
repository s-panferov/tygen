import { TypeKind, TypeReflectionBase, TypeReflection } from '../reflection'

export interface MappedTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Mapped
	typeParameter: TypeReflection
	templateType: TypeReflection
	constraintType: TypeReflection
}
