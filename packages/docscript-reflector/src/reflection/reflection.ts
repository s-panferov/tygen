import { InterfaceReflection } from './interface'
import { PropertyReflection } from './property'
import { TypeParameterReflection } from './type-parameter'
import { ModuleReflection } from './module'
import { EnumReflection, EnumMemberReflection } from './enum'
import { ObjectLiteralReflection } from './object'
import { FunctionReflection, MethodReflection } from './function'
import { FunctionScopedVariableReflection } from './signature'

export enum ReflectionKind {
	Type = 'Type',
	TypeLiteral = 'TypeLiteral',
	Enum = 'Enum',
	EnumMember = 'EnumMember',
	FunctionScopedVariable = 'FunctionScopedVariable',
	ObjectLiteral = 'ObjectLiteral',
	Link = 'Link',
	Module = 'Module',
	Interface = 'Interface',
	TypeParameter = 'TypeParameter',
	HeritageClause = 'HeritageClause',
	Property = 'Property',
	Function = 'Function',
	Method = 'Method'
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
	| ObjectLiteralReflection
	| FunctionReflection
	| FunctionScopedVariableReflection
	| MethodReflection

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
