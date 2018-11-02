import {
	BaseReflection,
	ReflectionKind,
	Reflection,
	ReflectionWithExports,
	ReflectionWithGlobals,
	ReflectionPath,
	ReflectionId
} from './reflection'

export interface PackageReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithExports,
		ReflectionWithGlobals,
		ReflectionWithStructure {
	kind: ReflectionKind.Package
	manifest: PackageJson
	main?: Reflection
}

export interface ReflectionWithReadme {
	readme?: string
}

export interface ReflectionIdWithChildren extends ReflectionId {
	children?: ReflectionIdWithChildren[]
}

export interface ReflectionWithStructure {
	id?: ReflectionPath
	modules?: ReflectionIdWithChildren[]
}

export interface FolderReflection
	extends BaseReflection,
		ReflectionWithReadme,
		ReflectionWithStructure {
	id: ReflectionPath
	kind: ReflectionKind.Folder
	name: string
}

export interface PackageJson {
	name: string
	version: string
	typings?: string
	types?: string
	main?: string
}
