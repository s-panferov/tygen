import { BaseReflection, ReflectionKind, ReflectionLink } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface PropertyReflection extends BaseReflection, ReflectionWithOrigin {
	kind: ReflectionKind.Property
	name: string
	type: TypeReflection
	getter?: boolean
	setter?: boolean
}

export interface ReflectionWithOrigin extends BaseReflection {
	origin?: ReflectionLink
}
