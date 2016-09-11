import {
	Symbol,
	SourceFile
} from 'typescript'

import { Context } from './index'
import { Item } from './items'
import { visitTopLevelDeclarations } from './ast/declaration'

interface WithLocals {
	locals: { [key: string]: Symbol }
}

export function processSourceFile(source: WithLocals, ctx: Context, foreign = false) {
	let declarations: any[] = []

	Object.keys(source.locals).forEach(symbolName => {
		let symbol = source.locals[symbolName]
		let declaration = symbol.declarations[0]
		declarations.push(declaration)
	})

	let indexed = {} as { [id: string]: Item }
	let [items] = visitTopLevelDeclarations(declarations, ctx)

	items = items.filter(item => {
		if ((foreign && ctx.included(item.selfRef.id)) || !foreign) {
			if (!item.selfRef.id) {
				console.error(item)
				throw new Error('item dont have id')
			}
			indexed[item.selfRef.id] = item
			return true
		}
	})

	ctx.currentModule.items = items
	ctx.currentModule.itemsIndex = indexed
}
