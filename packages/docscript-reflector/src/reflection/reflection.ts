import { InterfaceReflection } from './interface'
import { PropertyReflection } from './property'
import { TypeParameterReflection } from './type-parameter'
import { ModuleReflection, NamespaceReflection, ESModuleReflection } from './module'
import { EnumReflection, EnumMemberReflection } from './enum'
import { FunctionReflection, MethodReflection } from './function'
import { FunctionScopedVariableReflection, SignatureReflection } from './signature'
import { ClassReflection } from './class'
import { TypeAliasReflection } from './type-alias'
import { VariableReflection } from './variable'
import { TypeReflectionBase } from './type/type'
import { PackageReflection } from '../package'

export enum ReflectionKind {
	Type = 'Type',
	Signature = 'Signature',
	Class = 'Class',
	TypeLiteral = 'TypeLiteral',
	TypeAlias = 'TypeAlias',
	Enum = 'Enum',
	EnumMember = 'EnumMember',
	FunctionScopedVariable = 'FunctionScopedVariable',
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
	Package = 'Package'
}

export interface ReflectionWithExports {
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
	| FunctionScopedVariableReflection
	| MethodReflection
	| ClassReflection
	| TypeAliasReflection
	| VariableReflection
	| SignatureReflection
	| TypeReflectionBase
	| NamespaceReflection
	| ESModuleReflection
	| PackageReflection

export interface HasId {
	id: string
}

export function createLink<T extends Reflection>(ref: T): ReflectionLink | T {
	if (ref.kind === ReflectionKind.Link) {
		return ref
	} else if (ref.id) {
		return <ReflectionLink>{
			kind: ReflectionKind.Link,
			target: ref.id
		}
	} else {
		return ref
	}
}
