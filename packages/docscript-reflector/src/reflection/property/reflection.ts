import { BaseReflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface PropertyReflection extends BaseReflection {
	kind: ReflectionKind.Property
	name: string
	type: TypeReflection
}
