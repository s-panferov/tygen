import { InterfaceReflection } from './interface/reflection'
import { PropertyReflection } from './property/reflection'
import { TypeParameterReflection } from './type-parameter/reflection'
import { ModuleReflection, NamespaceReflection, ESModuleReflection } from './module/reflection'
import { EnumReflection, EnumMemberReflection } from './enum/reflection'
import { FunctionReflection, MethodReflection } from './function/reflection'
import { SignatureReflection } from './signature/reflection'
import { ClassReflection } from './class/reflection'
import { TypeAliasReflection } from './type-alias/reflection'
import { VariableReflection, ParameterReflection } from './variable/reflection'
import { TypeReflectionBase } from './_type/reflection'
import { PackageReflection, FolderReflection } from './package'

export enum ReflectionKind {
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
	Interface = 'Interface',
	HeritageClause = 'HeritageClause',
	Property = 'Property',
	Function = 'Function',
	Method = 'Method',
	Variable = 'Variable',
	Parameter = 'Parameter',
	Package = 'Package',
	Folder = 'Folder',
	NotSupported = 'NotSupported'
}

export interface ReflectionWithExports extends BaseReflection {
	exports?: Reflection[]
}

export interface BaseReflection {
	id?: string
	kind: ReflectionKind
	comments?: { kind: string; text: string }[]
	directives?: { name: string; text?: string }[]
}

export interface ReflectionLink extends BaseReflection {
	kind: ReflectionKind.Link
	target: string
	targetKind: ReflectionKind
}

export type Reflection =
	| ReflectionLink
	| InterfaceReflection
	| PropertyReflection
	| TypeParameterReflection
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
	| TypeReflectionBase
	| NamespaceReflection
	| ESModuleReflection
	| PackageReflection
	| FolderReflection

export interface HasId {
	id: string
}

export function createLink<T extends Reflection>(ref: T): ReflectionLink | T {
	if (ref.kind === ReflectionKind.Link) {
		return ref
	} else if (ref.id) {
		return <ReflectionLink>{
			kind: ReflectionKind.Link,
			target: ref.id,
			targetKind: ref.kind
		}
	} else {
		return ref
	}
}
