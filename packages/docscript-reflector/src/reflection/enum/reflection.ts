import { BaseReflection, ReflectionKind, ReflectionWithExports } from '../reflection'

export interface EnumMemberReflection extends BaseReflection {
	name: string
	kind: ReflectionKind.EnumMember
	value?: string | number | undefined
}

export interface EnumReflection extends ReflectionWithExports, BaseReflection {
	name: string
	kind: ReflectionKind.Enum
	members?: EnumMemberReflection[]
}
