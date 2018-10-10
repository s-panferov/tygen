import { BaseReflection, ReflectionKind, ReflectionPath } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface VariableReflection extends BaseReflection {
	id: ReflectionPath
	kind: ReflectionKind.Variable
	name: string
	type: TypeReflection
}

export interface ParameterReflection extends BaseReflection {
	id: ReflectionPath
	kind: ReflectionKind.Parameter
	name: string
	type: TypeReflection
	rest?: boolean
	optional?: boolean
}
