import { BaseReflection, ReflectionKind } from '../../reflection'
import { ObjectLikeReflection } from '../../interface/reflection'
import { ReflectionWithCallSignatures } from '../../signature/reflection'

export interface ObjectTypeReflection
	extends BaseReflection,
		ObjectLikeReflection,
		ReflectionWithCallSignatures {
	kind: ReflectionKind.ObjectLiteralType
}
