import { ReflectionKind, ReflectionWithExports, BaseReflection } from '../reflection'
import {
	ObjectLikeReflection,
	ReflectionWithTypeParameters,
	ReflectionWithBaseTypes
} from '../interface/reflection'

export interface ClassReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithBaseTypes {
	kind: ReflectionKind.Class
	name: string
}
