import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface TupleReflection extends BaseReflection {
	kind: ReflectionKind.TupleType
	types: TypeReflection[]
}
