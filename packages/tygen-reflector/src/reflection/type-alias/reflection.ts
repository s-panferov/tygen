import {
	ReflectionWithExports,
	BaseReflection,
	ReflectionKind,
	ReflectionPath
} from '../reflection'
import { TypeReflection } from '../_type/reflection'
import { ReflectionWithTypeParameters } from '../interface/reflection'

export interface TypeAliasReflection
	extends BaseReflection,
		ReflectionWithExports,
		ReflectionWithTypeParameters {
	id: ReflectionPath
	name: string
	kind: ReflectionKind.TypeAlias
	type: TypeReflection
}
