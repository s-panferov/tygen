const { format } = require('prettier/standalone')
const typescript = require('prettier/parser-typescript')
import ReactDOM from 'react-dom/server'
import TestRenderer from 'react-test-renderer'
import React from 'react'
import PropTypes from 'prop-types'

const unescape = require('./unescape')

export interface TreeItem {
	nodeType: 'component'
	instance: any
	props: {}
	rendered: string | (string | TreeItem)[]
	type: any
}

export function collectString(tree: string | TreeItem | (string | TreeItem)[]) {
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
		instance.replaces = []
	}

	const length = name.length
	let id = instance.context.ident.next().value.toString(36) as string

	if (id.length < length) {
		id = id.padEnd(id.length, '0')
	}

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
	const tree = test.toTree()

	const formatted = format(collectString(tree as any), {
		parser: 'typescript',
		semi: false,
		plugins: [typescript]
	})

	return formatted
}
