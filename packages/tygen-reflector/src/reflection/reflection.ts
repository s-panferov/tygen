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
	AmbientModuleReflection,
	NamespaceReflection,
	ESModuleReflection,
	DeclarationFileReflection
} from './module/reflection'

export enum ReflectionKind {
	Inventory = 'Inventory',
	Signature = 'Signature',
	Class = 'Class',
	TypeAlias = 'TypeAlias',
	TypeParameter = 'TypeParameter',
	Enum = 'Enum',
	EnumMember = 'EnumMember',
	Link = 'Link',
	DeclarationFile = 'DeclarationFile',
	AmbientModule = 'AmbientModule',
	Namespace = 'Namespace',
	ESModule = 'ESModule',
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
	tags?: { name: string; text?: string }[]
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
	| AmbientModuleReflection
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
	| DeclarationFileReflection
	| PackageReflection
	| FolderReflection
	| InventoryReflection
	| SearchReflection
	| NotSupportedReflection
	| NotIncludedReflection

export interface HasId {
	id: string
}
