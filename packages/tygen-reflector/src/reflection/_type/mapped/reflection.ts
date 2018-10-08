import { TypeReflection } from '../reflection'
import { ReflectionKind, BaseReflection } from '../../reflection'

export interface MappedTypeReflection extends BaseReflection {
	kind: ReflectionKind.MappedType
	typeParameter: TypeReflection
	templateType: TypeReflection
	constraintType: TypeReflection
}
