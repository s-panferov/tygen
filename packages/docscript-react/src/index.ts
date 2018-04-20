import { Converter, Reflection, ReflectionWalker } from '@docscript/reflector'

export class ReactConverter implements Converter {
	visitReflection(ref: Reflection, fileName: string, visitor: ReflectionWalker) {
		console.log(fileName)
		return undefined
	}
}

export default new ReactConverter()
