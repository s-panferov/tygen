import * as path from 'path'

import { Converter, Reflection, ReflectionWalker } from '@docscript/reflector'

import { renderHTML } from './html'

export class ReactConverter implements Converter {
	visitReflection(ref: Reflection, fileName: string, _visitor: ReflectionWalker) {
		let parsedPath = path.parse(fileName)
		return [{ content: renderHTML(ref, fileName), name: `${parsedPath.name}.html` }]
	}
}

export default new ReactConverter()
