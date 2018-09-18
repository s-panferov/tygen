import TestRenderer from 'react-test-renderer'
import React from 'react'
import PropTypes from 'prop-types'

const { format } = require('prettier')

export interface TreeItem {
	nodeType: 'component'
	instance: any
	props: {}
	rendered: string | (string | TreeItem)[]
	type: any
}

export type Tree = string | TreeItem | (string | TreeItem)[]

export function collectString(tree: Tree) {
	let res = ''
	if (typeof tree === 'string') {
		res += tree
	} else if (Array.isArray(tree)) {
		tree.forEach(item => {
			if (typeof item === 'string') {
				res += item
			} else {
				res += collectString(item.rendered)
			}
		})
	} else {
		res += collectString(tree.rendered)
	}

	return res
}

function* hexid(min: number, base: number) {
	let high = base
	let current = min
	while (true) {
		if (current === high) {
			yield high * min
			current = high * min + 1
			high *= base
		} else {
			yield current++
		}
	}
}

export function ident(instance: any, name: string, component: React.ReactElement<any>) {
	if (!instance.context.ident) {
		throw new Error('Please add PrettyContext')
	}

	if (!instance.replaces) {
		instance.replaces = {}
	}

	const length = name.length
	let id = ('$' + instance.context.ident.next().value.toString(36) + '$') as string

	if (id.length < length) {
		id = id.padEnd(length, '$')
	}

	instance.replaces[id] = component

	return id
}

export function keyword(
	instance: any,
	name: string,
	regexp: RegExp,
	component: React.ReactElement<any>
) {
	if (!instance.keywords) {
		instance.keywords = {}
	}

	instance.keywords[name] = { regexp, component }

	return name
}

export const PrettyContext = {
	ident: PropTypes.object
}

class ContextProvider extends React.Component {
	static childContextTypes = PrettyContext

	getChildContext = () => ({
		ident: hexid(10, 36)
	})

	render() {
		return this.props.children
	}
}

export class PrettyText<P = {}> extends React.Component<P> {
	static contextTypes = PrettyContext

	keywords = {} as any

	id(name: string, jsx: React.ReactElement<any>): string {
		return ident(this, name, jsx)
	}

	registerKeyword(id: string, regexp: RegExp, component: React.ReactElement<any>) {
		this.keywords[id] = { regexp, component }
	}
}

function parseKeywords(result: string[], keywords: any) {
	Object.keys(keywords).forEach(key => {
		let keyword = keywords[key]

		result = [].concat.apply(
			[],
			result.map(str => {
				if (typeof str !== 'string') {
					return [str]
				}

				let exec: RegExpExecArray | null
				let lastIndex = 0

				let re = keyword.regexp
				re.lastIndex = 0

				let strResult = [] as string[]

				while ((exec = re.exec(str))) {
					strResult.push(str.slice(lastIndex, exec.index))
					lastIndex = re.lastIndex
					const el = React.cloneElement(keyword.component)
					strResult.push(el as any)
				}

				strResult.push(str.slice(lastIndex))

				return strResult
			})
		)
	})

	return result
}

declare const prettierPlugins: any

export function prettyRender(subtree: React.ReactElement<any>) {
	const test = TestRenderer.create(<ContextProvider>{subtree}</ContextProvider>)
	const tree = (test.toTree() as any) as Tree

	const formatted = format(collectString(tree), {
		parser: 'typescript',
		semi: false,
		plugins: typeof prettierPlugins !== 'undefined' ? prettierPlugins : undefined
	}) as string

	const replaces = {} as any
	const keywords = {} as any

	function walk(tree: Tree) {
		if (Array.isArray(tree)) {
			tree.forEach(item => {
				if (typeof item !== 'string') {
					Object.assign(replaces, item.instance.replaces)
					Object.assign(keywords, item.instance.keywords)
					walk(item.rendered)
				}
			})
		} else if (typeof tree !== 'string') {
			Object.assign(replaces, tree.instance.replaces)
			Object.assign(keywords, tree.instance.keywords)
			walk(tree.rendered)
		}
	}

	walk(tree)

	let result = [] as any[]

	let re = /[$][a-z0-9]+[$]+/g
	let exec: RegExpExecArray | null
	let lastIndex = 0

	while ((exec = re.exec(formatted))) {
		result.push(formatted.slice(lastIndex, exec.index))
		lastIndex = re.lastIndex
		result.push(replaces[exec[0]])
	}

	result.push(formatted.slice(lastIndex))

	result = parseKeywords(result, keywords)

	result = result.map((item, i) => {
		if (typeof item !== 'string' && item.key === null) {
			return React.cloneElement(item, { key: '$' + i })
		} else {
			return item
		}
	})

	return result
}
