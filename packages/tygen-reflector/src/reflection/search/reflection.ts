import { BaseReflection, ReflectionKind, Identifier } from '../reflection'

export interface SearchReflection extends BaseReflection {
	kind: ReflectionKind.Search
	items: Identifier[]
}
