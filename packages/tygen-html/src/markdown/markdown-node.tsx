import * as React from 'react'

import { AST, Type, Parent } from './mdast'

import { TextUI } from './nodes/text'
import { ParagraphUI } from './nodes/paragraph'
import { RootUI } from './nodes/root'
import { HeadingUI } from './nodes/heading'
import { StrongUI } from './nodes/strong'
import { BlockquoteUI } from './nodes/blockquote'
import { CodeUI } from './nodes/code'
import { DeleteUI } from './nodes/delete'
import { FootnoteUI } from './nodes/footnote'
import { EmphasisUI } from './nodes/emphasis'
import { HtmlUI } from './nodes/html'
import { ImageUI } from './nodes/image'
import { LinkUI } from './nodes/link'
import { ListUI, ListItemUI } from './nodes/list'
import { TableUI } from './nodes/table'
import { ThematicBreakUI } from './nodes/thematic-break'

const NoteType: { [key: string]: React.ComponentClass<{ node: AST }> } = {
	[Type.Root]: RootUI,
	[Type.Paragraph]: ParagraphUI,
	[Type.Text]: TextUI,
	[Type.Heading]: HeadingUI,
	[Type.Strong]: StrongUI,
	[Type.Blockquote]: BlockquoteUI,
	[Type.Code]: CodeUI,
	[Type.InlineCode]: CodeUI,
	[Type.Delete]: DeleteUI,
	[Type.Emphasis]: EmphasisUI,
	[Type.Footnote]: FootnoteUI,
	[Type.HTML]: HtmlUI,
	[Type.Image]: ImageUI,
	[Type.Link]: LinkUI,
	[Type.List]: ListUI,
	[Type.ListItem]: ListItemUI,
	[Type.Table]: TableUI,
	[Type.ThematicBreak]: ThematicBreakUI
} as any

export namespace MarkdownNode {
	export interface Props {
		node: AST
	}
}
export class MarkdownNode extends React.Component<MarkdownNode.Props, {}> {
	render() {
		const { node } = this.props
		const NodeUI = NoteType[node.type]
		if (!NodeUI) {
			console.warn('Unsupported markdown AST node:', node)
			return null as any
		}
		return <NodeUI node={node} />
	}
}

export namespace Children {
	export interface Props {
		node: Parent
	}
}
export class Children extends React.Component<Children.Props, {}> {
	render() {
		const { node } = this.props
		if (node.children) {
			return (
				<React.Fragment>
					{node.children.map((child, index) => {
						return <MarkdownNode key={index} node={child} />
					})}
				</React.Fragment>
			)
		} else {
			return null as any
		}
	}
}
