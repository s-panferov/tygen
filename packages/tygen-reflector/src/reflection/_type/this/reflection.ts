import { ReflectionLink, BaseReflection, ReflectionKind } from '../../reflection'

export interface ThisReflection extends BaseReflection {
	kind: ReflectionKind.ThisType
	base?: ReflectionLink
}
