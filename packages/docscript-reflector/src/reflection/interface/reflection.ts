import {
	ReflectionLink,
	ReflectionWithExports,
	BaseReflection,
	ReflectionKind,
	Reflection
} from '../reflection'
import { TypeParameterReflection } from '../type-parameter/reflection'
import { TypeReflection } from '../_type/reflection'
import {
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures,
	ReflectionWithCallSignatures
} from '../signature/reflection'

export interface ReflectionWithProperties extends BaseReflection {
	ownProperties?: Reflection[]
	allProperties?: (Reflection | ReflectionLink)[]
}

export interface ReflectionWithTypeParameters {
	typeParameters?: TypeParameterReflection[]
}

export interface ReflectionWithBaseTypes {
	baseTypes?: TypeReflection[]
}

export interface ObjectLikeReflection
	extends ReflectionWithConstructSignatures,
		ReflectionWithIndexSignatures,
		ReflectionWithProperties {}

export interface InterfaceReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithCallSignatures,
		ReflectionWithBaseTypes {
	kind: ReflectionKind.Interface
	name: string
}
