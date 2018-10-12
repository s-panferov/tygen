import { InventoryReflection } from './inventory/reflection'
import { InterfaceReflection } from './interface/reflection'
import { PropertyReflection } from './property/reflection'

import { EnumReflection, EnumMemberReflection } from './enum/reflection'
import { FunctionReflection, MethodReflection } from './function/reflection'
import { SignatureReflection } from './signature/reflection'
import { ClassReflection } from './class/reflection'
import { TypeAliasReflection } from './type-alias/reflection'
import { VariableReflection, ParameterReflection } from './variable/reflection'
import { TypeReflection, TypeParameterReflection } from './_type/reflection'
import { PackageReflection, FolderReflection } from './package'
import { SearchReflection } from './search/reflection'

import {
	ModuleReflection,
	NamespaceReflection,
	ESModuleReflection,
	AmbientFileReflection
} from './module/reflection'
import { idFromPath } from './identifier'

export enum ReflectionKind {
	Inventory = 'Inventory',
	Signature = 'Signature',
	Class = 'Class',
	TypeAlias = 'TypeAlias',
	TypeParameter = 'TypeParameter',
	Enum = 'Enum',
	EnumMember = 'EnumMember',
	Link = 'Link',
	Module = 'Module',
	Namespace = 'Namespace',
	ESModule = 'ESModule',
	AmbientFile = 'AmbientFile',
	Interface = 'Interface',
	HeritageClause = 'HeritageClause',
	Property = 'Property',
	Function = 'Function',
	Method = 'Method',
	Variable = 'Variable',
	Parameter = 'Parameter',
	Package = 'Package',
	Folder = 'Folder',
	Search = 'Search',
	SubstitutionType = 'SubstitutionType',
	IndexType = 'IndexType',
	ConditionalType = 'ConditionalType',
	MappedType = 'MappedType',
	AnyType = 'AnyType',
	UndefinedType = 'UndefinedType',
	BooleanType = 'BooleanType',
	TypeParameterType = 'TypeParameterType',
	TypeReference = 'TypeReference',
	NeverType = 'NeverType',
	NullType = 'NullType',
	IntersectionType = 'IntersectionType',
	UnionType = 'UnionType',
	NumberType = 'NumberType',
	StringType = 'StringType',
	VoidType = 'VoidType',
	LinkType = 'LinkType',
	LiteralType = 'LiteralType',
	ObjectType = 'ObjectType',
	ObjectLiteralType = 'ObjectLiteralType',
	ESSymbolType = 'ESSymbolType',
	IndexedAccessType = 'IndexedAccessType',
	TupleType = 'TupleType',
	ThisType = 'ThisType',
	UnknownType = 'UnknownType',
	NotIncluded = 'NotIncluded',
	NotSupported = 'NotSupported'
}

export interface ReflectionWithExports extends BaseReflection {
	exports?: Reflection[]
}

export interface ReflectionWithGlobals extends BaseReflection {
	globals?: Reflection[]
}

export interface ReflectionId {
	name: string
	kind: ReflectionKind
	fileName: string
	anchor: string
	keywords?: string[]
	version?: string
}

export type ReflectionPath = ReflectionId[]

export interface BaseReflection {
	id?: ReflectionPath
	kind: ReflectionKind
	comments?: { kind: string; text: string }[]
	directives?: { name: string; text?: string }[]
	definedIn?: {
		source: ReflectionId
		start: number
		end: number
	}[]
}

export interface ReflectionLink extends BaseReflection {
	kind: ReflectionKind.Link
	target: ReflectionId
}

export interface NotIncludedReflection extends BaseReflection {
	kind: ReflectionKind.NotIncluded
	target: ReflectionId
}

export interface NotSupportedReflection extends BaseReflection {
	kind: ReflectionKind.NotSupported
}

export type Reflection =
	| ReflectionLink
	| InterfaceReflection
	| PropertyReflection
	| ModuleReflection
	| EnumReflection
	| EnumMemberReflection
	| FunctionReflection
	| MethodReflection
	| ClassReflection
	| TypeAliasReflection
	| TypeParameterReflection
	| VariableReflection
	| ParameterReflection
	| SignatureReflection
	| TypeReflection
	| NamespaceReflection
	| ESModuleReflection
	| AmbientFileReflection
	| PackageReflection
	| FolderReflection
	| InventoryReflection
	| SearchReflection
	| NotSupportedReflection
	| NotIncludedReflection

export interface HasId {
	id: string
}

export function createLink(ref: Reflection): ReflectionLink | NotIncludedReflection {
	if (ref.kind === ReflectionKind.Link || ref.kind === ReflectionKind.NotIncluded) {
		return ref
	} else if (ref.id) {
		return <ReflectionLink>{
			kind: ReflectionKind.Link,
			target: idFromPath(ref.id)
		}
	} else {
		throw new Error('Cannot create a link to the reflection')
	}
}
