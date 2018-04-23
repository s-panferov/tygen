import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface TupleReflection extends TypeReflectionBase {
	typeKind: TypeKind.Tuple
	types: TypeReflection[]
}
