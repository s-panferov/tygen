import { PropertyReflection } from '../property/reflection'
import {
	ReflectionLink,
	ReflectionWithExports,
	BaseReflection,
	ReflectionKind
} from '../reflection'
import { TypeParameterReflection } from '../type-parameter/reflection'
import { TypeReflection } from '../_type/reflection'
import {
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures,
	ReflectionWithCallSignatures
} from '../signature/reflection'

export interface ReflectionWithProperties {
	ownProperties?: PropertyReflection[]
	allProperties?: (PropertyReflection | ReflectionLink)[]
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
