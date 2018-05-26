import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { ViewSettings } from './view'
import * as path from 'path'

export interface Identifier {
	pkg: string
	version: string
	module?: string[]
	items?: IdentifierItem[]
}

export interface IdentifierItem {
	name: string
	file: boolean
}

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

export function parseId(id: string): Identifier {
	const [pkg, version, module, ...items] = id.split('->')

	let processedItems: IdentifierItem[] | undefined = undefined
	if (items && items.length > 0 ? items : undefined) {
		processedItems = []
		items.forEach(item => {
			const items = item.split('::')
			processedItems!.push({ name: items[0], file: true })
			items.slice(1).forEach(item => {
				processedItems!.push({ name: item, file: false })
			})
		})
	}

	return {
		pkg,
		version,
		module: module ? module.split('/') : undefined,
		items: processedItems
	}
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
