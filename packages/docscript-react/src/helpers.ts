export interface Identifier {
	pkg: string
	version: string
	module?: string[]
	items?: string[]
}

export function parseId(id: string): Identifier {
	let [pkg, version, module, ...items] = id.split('::')
	return {
		pkg,
		version,
		module: module ? module.split('/') : undefined,
		items: items && items.length > 0 ? items : undefined
	}
}
