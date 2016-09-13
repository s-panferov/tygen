import {
	Node
} from 'typescript'

let doctrine = require('doctrine')

export interface Tag {
	title: string
	description?: string
	type?: any
	name?: any
}

export interface Comment {
	description: string
	tags: Tag[]
}

export function visitComment(node: Node): Comment {
	let start = node.getStart()
	let sourceFile = node.getSourceFile()
	let getLeadingTriviaWidth = node.getLeadingTriviaWidth()
	let trivia = sourceFile.getFullText().slice(
		start - getLeadingTriviaWidth,
		start
	).trim()

	let jsdoc = doctrine.parse(trivia, { unwrap: true })
	return jsdoc
}
