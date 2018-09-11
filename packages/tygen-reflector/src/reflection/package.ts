import {
	BaseReflection,
	ReflectionKind,
	Reflection,
	ReflectionWithExports,
	ReflectionWithGlobals
} from './reflection'

export interface PackageReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithExports,
		ReflectionWithGlobals,
		ReflectionWithStructure {
	kind: ReflectionKind.Package
	manifest: Manifest
	main?: Reflection
}

export interface ReflectionWithReadme {
	readme?: string
}

export interface ReflectionWithStructure {
	id?: string
	modules: Reflection[]
}

export interface FolderReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithStructure {
	kind: ReflectionKind.Folder
	name: string
}

export interface Manifest {
	name: string
	version: string
	typings?: string
	main?: string
}
