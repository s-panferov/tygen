import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface SubstitutionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Substitution
	typeVariable: TypeReflection
	substitute: TypeReflection
}
