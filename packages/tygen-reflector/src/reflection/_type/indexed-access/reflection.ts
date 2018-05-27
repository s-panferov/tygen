import { TypeKind, TypeReflection, TypeReflectionBase } from '../reflection'

export interface IndexedAccessReflection extends TypeReflectionBase {
	typeKind: TypeKind.IndexedAccess
	indexType: TypeReflection
	objectType: TypeReflection
}
