import { InterfaceReflection } from './interface'
import { PropertyReflection } from './property'
import { TypeParameterReflection } from './type-parameter'
import { ModuleReflection } from './module'
import { EnumReflection, EnumMemberReflection } from './enum'
import { FunctionReflection, MethodReflection } from './function'
import { FunctionScopedVariableReflection } from './signature'
import { ClassReflection } from './class'
import { TypeAliasReflection } from './type-alias'
import { VariableReflection } from './variable'

export enum ReflectionKind {
	Type = 'Type',
	Class = 'Class',
	TypeLiteral = 'TypeLiteral',
	TypeAlias = 'TypeAlias',
	Enum = 'Enum',
	EnumMember = 'EnumMember',
	FunctionScopedVariable = 'FunctionScopedVariable',
	Link = 'Link',
	Module = 'Module',
	Interface = 'Interface',
	HeritageClause = 'HeritageClause',
	Property = 'Property',
	Function = 'Function',
	Method = 'Method',
	Variable = 'Variable'
}

export interface ReflectionWithExports {
	exports?: Reflection[]
}

export interface BaseReflection {
	id?: string
	kind: ReflectionKind
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

export interface HasId {
	id: string
}

export function createLink(ref: Reflection): Reflection {
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
