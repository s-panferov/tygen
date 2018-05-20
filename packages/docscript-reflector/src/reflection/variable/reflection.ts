import { BaseReflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface VariableReflection extends BaseReflection {
	kind: ReflectionKind.Variable
	name: string
	type: TypeReflection
}

export interface ParameterReflection extends BaseReflection {
	kind: ReflectionKind.Parameter
	name: string
	type: TypeReflection
	rest?: boolean
	optional?: boolean
}
