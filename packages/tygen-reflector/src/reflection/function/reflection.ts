import { BaseReflection, ReflectionKind, ReflectionWithExports } from '../reflection'
import { ReflectionWithCallSignatures } from '../signature/reflection'

export interface FunctionBaseReflection extends BaseReflection, ReflectionWithCallSignatures {
	name: string
}

export interface FunctionReflection extends ReflectionWithExports, FunctionBaseReflection {
	kind: ReflectionKind.Function
}

export interface MethodReflection extends FunctionBaseReflection {
	kind: ReflectionKind.Method
}
