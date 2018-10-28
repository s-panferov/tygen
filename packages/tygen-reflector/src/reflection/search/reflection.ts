import { BaseReflection, ReflectionKind, ReflectionId } from '../reflection'

export interface SearchReflection extends BaseReflection {
	kind: ReflectionKind.Search
	packages: { [pkgVersion: string]: ReflectionId[] }
}
