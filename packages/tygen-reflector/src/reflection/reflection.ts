import { InventoryReflection } from './inventory/reflection'
import { InterfaceReflection } from './interface/reflection'
import { PropertyReflection } from './property/reflection'

import { EnumReflection, EnumMemberReflection } from './enum/reflection'
import { FunctionReflection, MethodReflection } from './function/reflection'
import { SignatureReflection } from './signature/reflection'
import { ClassReflection } from './class/reflection'
import { TypeAliasReflection } from './type-alias/reflection'
import { VariableReflection, ParameterReflection } from './variable/reflection'
import { TypeReflection } from './_type/reflection'
import { PackageReflection, FolderReflection } from './package'
import { SearchReflection } from './search/reflection'

import {
	ModuleReflection,
	NamespaceReflection,
	ESModuleReflection,
	AmbientFileReflection
} from './module/reflection'

export enum ReflectionKind {
	Inventory = 'Inventory',
	Type = 'Type',
	Signature = 'Signature',
	Class = 'Class',
	TypeLiteral = 'TypeLiteral',
	TypeAlias = 'TypeAlias',
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
	NotIncluded = 'NotIncluded',
	NotSupported = 'NotSupported'
}

export interface ReflectionWithExports extends BaseReflection {
	exports?: Reflection[]
}

export interface ReflectionWithGlobals extends BaseReflection {
	globals?: Reflection[]
}

export interface BaseReflection {
	id?: string
	kind: ReflectionKind
	comments?: { kind: string; text: string }[]
	directives?: { name: string; text?: string }[]
	definedIn?: {
		source: string
		start: number
		end: number
	}[]
}

export interface ReflectionLink extends BaseReflection {
	kind: ReflectionKind.Link
	target: string
	targetKind: ReflectionKind
}

export interface NotIncludedReflection extends BaseReflection {
	kind: ReflectionKind.NotIncluded
	name: string
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
			target: ref.id,
			targetKind: ref.kind
		}
	} else {
		throw new Error('Cannot create a link to the reflection')
	}
}
