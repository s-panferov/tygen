import { Reflection } from './reflection/reflection'
import { ReflectionWalker } from './walker'

export interface File {
	content: string
	name: string
}

export interface Converter {
	visitReflection(
		reflection: Reflection,
		fileName: string,
		walker: ReflectionWalker
	): File[] | undefined
}
