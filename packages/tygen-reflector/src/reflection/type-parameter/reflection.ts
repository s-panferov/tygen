import { ReflectionKind, BaseReflection } from '../reflection'

export interface TypeParameterReflection extends BaseReflection {
	name: string
	kind: ReflectionKind.TypeParameter
	constraint?: never
	default?: never
	expression?: never
}
