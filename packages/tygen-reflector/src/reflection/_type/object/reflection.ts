import { ReflectionKind, BaseReflection } from '../../reflection'
import { ObjectLikeReflection } from '../../interface/reflection'
import { ReflectionWithCallSignatures } from '../../signature/reflection'
import { TypeKind } from '../reflection'

export interface ObjectTypeReflection
	extends BaseReflection,
		ObjectLikeReflection,
		ReflectionWithCallSignatures {
	kind: ReflectionKind.Type
	typeKind: TypeKind.ObjectLiteral
}
