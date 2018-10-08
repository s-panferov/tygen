import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface IndexedAccessReflection extends BaseReflection {
	kind: ReflectionKind.IndexedAccessType
	indexType: TypeReflection
	objectType: TypeReflection
}
