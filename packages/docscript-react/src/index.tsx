import * as path from 'path'

import { Converter, Reflection, ReflectionWalker } from '@docscript/reflector'
import { renderHTML } from './html'
import { ReactConverterSettings } from './settings'

export class ReactConverter implements Converter {
	options: ReactConverterSettings

	constructor(options: ReactConverterSettings) {
		this.options = options
	}

	visitReflection(ref: Reflection, fileName: string, _visitor: ReflectionWalker) {
		const parsedPath = path.parse(fileName)
		return [
			{
				content: renderHTML(ref, fileName, this.options),
				name: `${parsedPath.name}.html`
			}
		]
	}
}

export default (argv: any) => new ReactConverter(argv)
