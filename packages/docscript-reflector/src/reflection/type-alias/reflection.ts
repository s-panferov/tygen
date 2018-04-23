import { ReflectionWithExports, BaseReflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface TypeAliasReflection extends BaseReflection, ReflectionWithExports {
	name: string
	kind: ReflectionKind.TypeAlias
	type: TypeReflection
}
