import { ReflectionWithExports, BaseReflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'
import { ReflectionWithTypeParameters } from '../interface/reflection'

export interface TypeAliasReflection
	extends BaseReflection,
		ReflectionWithExports,
		ReflectionWithTypeParameters {
	name: string
	kind: ReflectionKind.TypeAlias
	type: TypeReflection
}
