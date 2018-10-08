import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface SubstitutionTypeReflection extends BaseReflection {
	kind: ReflectionKind.SubstitutionType
	typeVariable: TypeReflection
	substitute: TypeReflection
}
