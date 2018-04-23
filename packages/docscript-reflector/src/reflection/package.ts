import { BaseReflection, ReflectionKind, Reflection } from './reflection'

export interface PackageReflection
	extends BaseReflection,
		ReflectionWithReadme,
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
}

export interface Manifest {
	name: string
	version: string
	typings?: string
}
