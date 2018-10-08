import { BaseReflection, ReflectionKind } from '../../reflection'

export interface ESSymbolReflection extends BaseReflection {
	kind: ReflectionKind.ESSymbolType
}
