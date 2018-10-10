import { Reflection, ReflectionKind } from '@tygen/reflector'
import { ViewSettings } from './view'
import * as path from 'path'

export function normalizePath(settings: ViewSettings, filePath: string) {
	let result = path.relative(settings.path, filePath)
	if (settings.static) {
		let [main, hash] = result.split('#')
		result = path.join(main, 'index.html')
		if (hash) {
			result += '#' + hash
		}
	}
	return result
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
