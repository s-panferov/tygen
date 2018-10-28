import { ReflectionKind, BaseReflection, ReflectionPath } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface TypeParameterReflection extends BaseReflection {
	id: ReflectionPath
	name: string
	kind: ReflectionKind.TypeParameter
	constraint?: TypeReflection
	default?: TypeReflection
	expression?: never
}
