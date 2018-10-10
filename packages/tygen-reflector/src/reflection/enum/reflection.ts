import {
	BaseReflection,
	ReflectionKind,
	ReflectionWithExports,
	ReflectionPath
} from '../reflection'

export interface EnumMemberReflection extends BaseReflection {
	name: string
	kind: ReflectionKind.EnumMember
	value?: string | number | undefined
}

export interface EnumReflection extends ReflectionWithExports, BaseReflection {
	id: ReflectionPath
	name: string
	kind: ReflectionKind.Enum
	members?: EnumMemberReflection[]
}
