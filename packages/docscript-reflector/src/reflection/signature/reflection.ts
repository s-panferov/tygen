import { ReflectionLink, BaseReflection, Reflection, ReflectionKind } from '../reflection'
import { TypeReflection } from '../_type/reflection'

export interface ReflectionWithCallSignatures {
	ownCallSignatures?: SignatureReflection[]
	allCallSignatures?: (ReflectionLink | SignatureReflection)[]
}

export interface ReflectionWithConstructSignatures {
	constructSignatures?: SignatureReflection[]
}

export interface ReflectionWithIndexSignatures {
	numberIndexType?: TypeReflection
	stringIndexType?: TypeReflection
}

export interface SignatureReflection extends BaseReflection {
	kind: ReflectionKind.Signature
	parameters: Reflection[]
	typeParameters?: Reflection[]
	returnType: Reflection
}

export interface FunctionScopedVariableReflection extends BaseReflection {
	kind: ReflectionKind.FunctionScopedVariable
	name: string
	type: TypeReflection
}
