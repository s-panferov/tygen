const unified = require('unified')
const parse = require('remark-parse')
// const toc = require('remark-toc')

export * from './mdast'

// const html = require('remark-html');
const parser = unified().use(parse)
// .use(toc)

import { AST, Root, isParent } from './mdast'

export function parseMarkdown(str: string): Root {
	const parse = parser.parse(str)
	return parser.runSync(parse)
}

export function forEachNode(ast: AST, cb: (type: AST) => void) {
	cb(ast)
	if (isParent(ast)) {
		ast.children.forEach(child => {
			forEachNode(child, cb)
		})
	}
}
