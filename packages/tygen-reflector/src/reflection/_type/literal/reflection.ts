import { ReflectionKind, BaseReflection } from '../../reflection'

export interface LiteralTypeReflection extends BaseReflection {
	kind: ReflectionKind.LiteralType
	value: number | string | boolean
}
