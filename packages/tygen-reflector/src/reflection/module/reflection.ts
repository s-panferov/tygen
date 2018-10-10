import {
	BaseReflection,
	ReflectionWithExports,
	ReflectionKind,
	ReflectionPath
} from '../reflection'

export interface ModuleReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.Module
	name: string
}

export interface NamespaceReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.Namespace
	name: string
}

export interface ESModuleReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.ESModule
	name: string
	folder: string
}

export interface AmbientFileReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.AmbientFile
	name: string
	folder: string
}
