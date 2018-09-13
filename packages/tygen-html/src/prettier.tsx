const { format } = require('prettier/standalone')
const typescript = require('prettier/parser-typescript')
import TestRenderer from 'react-test-renderer'
import React from 'react'
import PropTypes from 'prop-types'

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

function* hexid(min, base) {
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

export function prettyRender(subtree: React.ReactElement<any>) {
	const test = TestRenderer.create(<ContextProvider>{subtree}</ContextProvider>)
	const tree = (test.toTree() as any) as Tree

	const formatted = format(collectString(tree), {
		parser: 'typescript',
		semi: false,
		plugins: [typescript]
	}) as string

	const replaces = {} as any

	function walk(tree: Tree) {
		if (Array.isArray(tree)) {
			tree.forEach(item => {
				if (typeof item !== 'string') {
					Object.assign(replaces, item.instance.replaces)
					walk(item.rendered)
				}
			})
		} else if (typeof tree !== 'string') {
			Object.assign(replaces, tree.instance.replaces)
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

	return result
}
