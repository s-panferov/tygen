import { BaseReflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface VariableReflection extends BaseReflection {
	kind: ReflectionKind.Variable | ReflectionKind.Parameter
	name: string
	type: TypeReflection
}
