import path from 'path'

import { Reflection, ReflectionKind } from '@tygen/reflector'
import { ViewSettings } from './view'

export function normalizePath(settings: ViewSettings, filePath: string) {
	if (settings.static) {
	let result = ''
		let [main, hash] = filePath.split('#')
		result = path.join(main, 'index.html')
		if (hash) {
			result += '#' + hash
		}
		return result
	}

	return filePath
}

export function key(reflection: Reflection) {
	switch (reflection.kind) {
		case ReflectionKind.Link:
			return reflection.target
		default:
			if (reflection.id) {
				return reflection.id
			} else {
				return
			}
	}
}
