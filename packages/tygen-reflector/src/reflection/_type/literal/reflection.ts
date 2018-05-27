import { TypeReflectionBase, TypeKind } from '../reflection'

export interface LiteralTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Literal
	value: number | string | boolean
}
