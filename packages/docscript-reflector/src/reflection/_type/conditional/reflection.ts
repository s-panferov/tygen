import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'

export interface ConditionalTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Conditional
	checkType: TypeReflection
	extendsType: TypeReflection
	trueType?: TypeReflection
	falseType?: TypeReflection
	inferTypeParameters?: TypeReflection[]
}
