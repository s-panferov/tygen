import { TypeReflectionBase, TypeKind } from '../reflection'
import { ReflectionLink } from '@docscript/reflector'

export interface ThisReflection extends TypeReflectionBase {
	typeKind: TypeKind.This
	base?: ReflectionLink
}
