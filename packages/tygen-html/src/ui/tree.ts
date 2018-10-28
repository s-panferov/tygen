import { observable, computed, action, runInAction } from 'mobx'

export interface FilterResult {
	score: number
}

export abstract class TreeItem<I extends object = {}, C extends TreeItem = C> {
	readonly key: string

	children = observable.array<C>()

	info!: ItemInfo & I

	@observable.ref
	lastFilterResult?: FilterResult

	@observable.ref
	parent?: TreeItem

	constructor(key: string, info: I, children: C[] = []) {
		this.key = key

		runInAction(() => {
			this.children.push(...children)
			children.forEach(c => {
				c.parent = this
			})

			this.info = observable.object(info)
		})
	}

	@computed
	get visible(): boolean {
		if (!this.lastFilterResult) {
			return true
		}

		if (this.lastFilterResult.score > 0) {
			return true
		}

		if (this.children.some(c => c.visible)) {
			return true
		}

		return false
	}

	/**
	 * Returns maximum subtree score
	 */
	@computed
	get score(): number {
		if (this.lastFilterResult) {
			let score: number = 0
			score = this.lastFilterResult.score
			this.children.forEach(c => {
				if (c.score > score) {
					score = c.score
				}
			})

			return score
		} else {
			return Number.MAX_SAFE_INTEGER - (this.info.order || 0)
		}
	}

	@computed
	get flat(): (this | C)[] {
		const flat: (this | C)[] = []
		if (this.visible) {
			flat.push(this)
			this.children
				.slice()
				.sort((a, b) => {
					return b.score - a.score
				})
				.forEach(c => {
					flat.push(...(c.flat.slice() as any))
				})
		}
		return flat
	}

	@computed
	get depth(): number {
		if (!this.parent) {
			return 0
		} else {
			return this.parent.depth + 1
		}
	}

	abstract filter<O>(query: string, options: O, engine: QueryEngine<O>): void

	@action
	resetFilter() {
		this.children.forEach(c => {
			c.resetFilter()
		})
		this.lastFilterResult = undefined
	}
}

export interface ItemInfo {
	order?: number
}

export interface TextItemInfo extends ItemInfo {
	text: string
}

export class TextItem<T extends object = {}, C extends TreeItem = C> extends TreeItem<
	TextItemInfo & T,
	C
> {
	InfoType!: T

	lastFilterResult?: FilterResult & { match: number[] }

	@computed
	get text() {
		return this.info.text
	}

	@action
	filter<O>(query: string, options: O, engine: QueryEngine<O>): void {
		this.children.forEach(c => c.filter(query, options, engine))
		this.lastFilterResult = {
			score: engine.score(this.text, query, options),
			match: engine.match(this.text, query, options)
		}
	}
}

export class Tree<Item extends TreeItem, E> {
	children = observable.array<Item>()
	ext!: E

	constructor(items: Item[] = [], ext?: (tree: Tree<Item, {}>) => E) {
		runInAction(() => {
			let lastOrder: number = 0
			items.forEach(item => {
				if (item.info.order) {
					lastOrder = item.info.order
				} else {
					item.info.order = lastOrder++
				}
			})

			this.children.push(...items)
			this.ext = ext ? ext(this) : ({} as any)
		})
	}

	@computed
	get flat(): Item[] {
		const flat: Item[] = []
		this.children
			.slice()
			.sort((a, b) => {
				return b.score - a.score
			})
			.forEach(c => {
				flat.push(...(c.flat as any[]))
			})

		return flat
	}

	@action
	filter<O>(query: string, options: O, engine: QueryEngine<O>) {
		this.children.forEach(c => c.filter(query, options, engine))
	}

	@action
	resetFilter() {
		this.children.forEach(c => c.resetFilter())
	}
}

export interface QueryEngine<O> {
	Options: O

	score(text: string, query: string, options?: O): number
	match(text: string, query: string, options?: O): number[]
}

export type TreeItemWithSelection = TreeItem<{ selected?: boolean }>

export class TreeNavigation<I extends TreeItemWithSelection> {
	private tree: Tree<I, any>

	static ext = <I extends TreeItemWithSelection>(tree: Tree<I, any>): TreeNavigation<I> => {
		return new TreeNavigation(tree)
	}

	@observable
	private index = -1

	@observable.ref
	current: I | undefined

	constructor(tree: Tree<I, any>) {
		this.tree = tree
	}

	reset() {
		this.modify(() => {
			this.index = -1
		})
	}

	@action
	private modify(cb: () => void) {
		if (this.current) {
			this.current.info.selected = false
		}
		cb()
		this.current = this.tree.flat[this.index]
		if (this.current) {
			this.current.info.selected = true
		}
	}

	@action
	down() {
		this.modify(() => {
			this.index++
			if (this.index >= this.tree.flat.length) {
				this.index = -1
			}
		})
	}

	@action
	up() {
		this.modify(() => {
			this.index--
			if (this.index < -1) {
				this.index = -1
			}
		})
	}
}
