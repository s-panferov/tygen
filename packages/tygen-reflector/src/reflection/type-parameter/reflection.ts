import { ReflectionKind, BaseReflection, ReflectionPath } from '../reflection'

export interface TypeParameterReflection extends BaseReflection {
	id: ReflectionPath
	name: string
	kind: ReflectionKind.TypeParameter
	constraint?: never
	default?: never
	expression?: never
}
