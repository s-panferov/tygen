import { observable, computed, action, runInAction } from 'mobx'
import { score, match, Query, prepareQuery } from 'fuzzaldrin-plus'

export interface FilterResult {
	score: number
}

const FuzzOptions = Object.freeze({
	pathSeparator: '->'
})

export abstract class TreeItem<T extends ItemInfo = ItemInfo, C extends TextItemInfo = C> {
	readonly key: string

	children = observable.array<TreeItem<C>>()

	info!: T

	@observable.ref
	lastFilterResult?: FilterResult

	@observable.ref
	parent?: TreeItem

	constructor(key: string, info: T, children: TreeItem<C>[] = []) {
		this.key = key

		runInAction(() => {
			this.children.push(...children)
			children.forEach(c => {
				c.parent = this
			})

			this.info = observable.object(info, undefined, {
				proxy: true
			})
		})
	}

	@computed
	get visible(): boolean {
		if (!this.lastFilterResult) {
			console.log(this, 'is visible: not search')
			return true
		}

		if (this.lastFilterResult.score > 0) {
			console.log(this, 'is visible: score is ' + this.lastFilterResult.score)
			return true
		}

		if (this.children.some(c => c.visible)) {
			console.log(this, 'is visible, because child is visible')
			return true
		}

		console.log(this, 'is not visible')

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
			return this.info.order || 0
		}
	}

	@computed
	get flat(): TreeItem<any>[] {
		const flat: TreeItem<any>[] = []
		if (this.visible) {
			flat.push(this)
			this.children
				.slice()
				.sort((a, b) => {
					return b.score - a.score
				})
				.forEach(c => {
					flat.push(...c.flat.slice())
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

	abstract filter(query: string, preparedQuery: Query): void

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

export class TextItem<
	T extends TextItemInfo = TextItemInfo,
	C extends TextItemInfo = T
> extends TreeItem<TextItemInfo & T, C> {
	InfoType!: T

	lastFilterResult?: FilterResult & { match: number[] }

	@computed
	get text() {
		return this.info.text
	}

	@action
	filter(query: string, preparedQuery: Query) {
		this.children.forEach(c => c.filter(query, preparedQuery))
		this.lastFilterResult = {
			score: score(this.text, query, {
				preparedQuery,
				...FuzzOptions
			}),
			match: match(this.text, query, {
				preparedQuery,
				...FuzzOptions
			})
		}

		// console.log(this, query, preparedQuery, this.lastFilterResult)
	}
}

export class Tree<Item extends TreeItem = TreeItem> {
	children = observable.array<Item>()

	constructor(items: Item[] = []) {
		let lastOrder: number = 0
		items.forEach(item => {
			if (item.info.order) {
				lastOrder = item.info.order
			} else {
				item.info.order = lastOrder++
			}
		})
		this.children.push(...items)
	}

	@computed
	get flat(): Item[] {
		this.query

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

	@observable.ref
	query!: string

	@action
	filter(query: string) {
		this.query = query
		const preparedQuery = prepareQuery(query, { ...FuzzOptions })
		console.log(query, preparedQuery)
		this.children.forEach(c => c.filter(query, preparedQuery))
	}

	@action
	resetFilter() {
		this.children.forEach(c => c.resetFilter())
	}
}
