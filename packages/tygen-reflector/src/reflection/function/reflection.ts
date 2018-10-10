import {
	BaseReflection,
	ReflectionKind,
	ReflectionWithExports,
	ReflectionPath
} from '../reflection'

import { ReflectionWithCallSignatures } from '../signature/reflection'

export interface FunctionBaseReflection extends BaseReflection, ReflectionWithCallSignatures {
	name: string
}

export interface FunctionReflection extends ReflectionWithExports, FunctionBaseReflection {
	id: ReflectionPath
	kind: ReflectionKind.Function
}

export interface MethodReflection extends FunctionBaseReflection {
	id: ReflectionPath
	kind: ReflectionKind.Method
}
