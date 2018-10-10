import { TypeParameterReflection } from '../type-parameter/reflection'
import { TypeReflection } from '../_type/reflection'

import {
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures,
	ReflectionWithCallSignatures
} from '../signature/reflection'

import {
	ReflectionLink,
	ReflectionWithExports,
	BaseReflection,
	ReflectionKind,
	Reflection,
	ReflectionPath
} from '../reflection'

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
	id: ReflectionPath
	kind: ReflectionKind.Interface
	name: string
}
