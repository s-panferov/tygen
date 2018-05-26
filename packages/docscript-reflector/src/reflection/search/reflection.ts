import { BaseReflection, ReflectionKind } from '../reflection'

export interface SearchReflection extends BaseReflection {
	kind: ReflectionKind.Search
	items: string[]
}
