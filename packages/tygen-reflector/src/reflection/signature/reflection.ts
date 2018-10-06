import {
	ReflectionLink,
	BaseReflection,
	Reflection,
	ReflectionKind,
	NotIncludedReflection
} from '../reflection'

import { TypeReflection, TypeParameterReflection } from '../_type/reflection'
import { ReflectionWithOrigin } from '../property/reflection'

export interface ReflectionWithCallSignatures {
	ownCallSignatures?: SignatureReflection[]
	allCallSignatures?: (ReflectionLink | NotIncludedReflection | SignatureReflection)[]
}

export interface ReflectionWithConstructSignatures {
	constructSignatures?: SignatureReflection[]
}

export interface ReflectionWithIndexSignatures {
	numberIndexType?: TypeReflection
	stringIndexType?: TypeReflection
}

export interface SignatureReflection extends BaseReflection, ReflectionWithOrigin {
	kind: ReflectionKind.Signature
	parameters: Reflection[]
	typeParameters?: TypeParameterReflection[]
	returnType: TypeReflection
	name: string
}
