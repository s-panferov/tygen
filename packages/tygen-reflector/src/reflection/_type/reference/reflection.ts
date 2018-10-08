import { TypeReflection } from '../reflection'
import { BaseReflection, ReflectionKind } from '../../reflection'

export interface TypeReferenceReflection extends BaseReflection {
	kind: ReflectionKind.TypeReference
	target: TypeReflection
	typeArguments?: TypeReflection[]
}
