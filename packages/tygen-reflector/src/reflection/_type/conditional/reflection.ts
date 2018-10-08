import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface ConditionalTypeReflection extends BaseReflection {
	kind: ReflectionKind.ConditionalType
	checkType: TypeReflection
	extendsType: TypeReflection
	trueType?: TypeReflection
	falseType?: TypeReflection
	inferTypeParameters?: TypeReflection[]
}
