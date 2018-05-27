import { BaseReflection, ReflectionWithExports, ReflectionKind } from '../reflection'

export interface ModuleReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.Module
	name: string
}

export interface NamespaceReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.Namespace
	name: string
}

export interface ESModuleReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.ESModule
	name: string
	folder: string
}
