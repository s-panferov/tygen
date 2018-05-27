import { TypeReflectionBase, TypeKind } from '../reflection'
import { ReflectionLink } from '@tygen/reflector'

export interface ThisReflection extends TypeReflectionBase {
	typeKind: TypeKind.This
	base?: ReflectionLink
}
