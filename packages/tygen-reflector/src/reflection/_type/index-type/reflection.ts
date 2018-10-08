import { TypeReflection } from '../reflection'
import { ReflectionKind, BaseReflection } from '../../reflection'

export interface IndexTypeReflection extends BaseReflection {
	kind: ReflectionKind.IndexType
	type: TypeReflection
}
