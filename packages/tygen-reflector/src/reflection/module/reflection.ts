import {
	BaseReflection,
	ReflectionWithExports,
	ReflectionKind,
	ReflectionPath
} from '../reflection'

export interface AmbientModuleReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.AmbientModule
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

export interface DeclarationFileReflection extends BaseReflection, ReflectionWithExports {
	id: ReflectionPath
	kind: ReflectionKind.DeclarationFile
	name: string
	folder: string
}
