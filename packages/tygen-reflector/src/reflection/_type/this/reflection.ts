import { TypeReflectionBase, TypeKind } from '../reflection'
import { ReflectionLink } from '../../reflection'

export interface ThisReflection extends TypeReflectionBase {
	typeKind: TypeKind.This
	base?: ReflectionLink
}
