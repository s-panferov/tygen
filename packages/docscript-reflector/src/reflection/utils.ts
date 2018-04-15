import * as ts from 'typescript'

export type SymbolWithParent = ts.Symbol & { parent?: SymbolWithParent }
export function isReachable(symbol: SymbolWithParent) {
	let parent = symbol.parent
	while (parent) {
		if (parent.flags & ts.SymbolFlags.Module) {
			return true
		}
		parent = parent.parent
	}

	return false
}
