import {
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	Reflection,
	ReflectionPath
} from '../reflection'
import {
	ObjectLikeReflection,
	ReflectionWithTypeParameters,
	ReflectionWithBaseTypes
} from '../interface/reflection'

export interface ReflectionWithImplements extends BaseReflection {
	implements?: Reflection[]
}

export interface ClassReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithBaseTypes,
		ReflectionWithImplements {
	id: ReflectionPath
	kind: ReflectionKind.Class
	name: string
}
