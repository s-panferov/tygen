export interface Point {
	line: number
	column: number
	offset: number
}

export interface Position {
	start: Point
	end: Point
	indent?: number
}

export interface Data {}

export interface Node {
	type: string
	data?: Data
	position?: Position
}

export interface Text extends Node {
	value: string
}

export interface Parent extends Node {
	children: AST[]
}

export function isParent(node: Node): node is Parent {
	return node.hasOwnProperty('children')
}

export type AST =
	| Root
	| Paragraph
	| Blockquote
	| Heading
	| Code
	| InlineCode
	| YAML
	| HTML
	| List
	| ListItem
	| Table
	| TableRow
	| TableCell
	| ThematicBreak
	| Break
	| Emphasis
	| Strong
	| Delete
	| Link
	| Image
	| Footnote
	| LinkReference
	| ImageReference
	| FootnoteReference
	| Definition
	| FootnoteDefinition
	| TextNode

export enum Type {
	Root = 'root',
	Paragraph = 'paragraph',
	Blockquote = 'blockquote',
	Heading = 'heading',
	Code = 'code',
	InlineCode = 'inlineCode',
	YAML = 'yaml',
	HTML = 'html',
	List = 'list',
	ListItem = 'listItem',
	Table = 'table',
	TableRow = 'tableRow',
	TableCell = 'tableCell',
	ThematicBreak = 'thematicBreak',
	Break = 'break',
	Emphasis = 'emphasis',
	Strong = 'strong',
	Delete = 'delete',
	Link = 'link',
	Image = 'image',
	Footnote = 'footnote',
	LinkReference = 'linkReference',
	ImageReference = 'imageReference',
	FootnoteReference = 'footnoteReference',
	Definition = 'definition',
	FootnoteDefinition = 'footnoteDefinition',
	Text = 'text'
}

export interface Root extends Parent {
	type: Type.Root
}

export interface Paragraph extends Parent {
	type: Type.Paragraph
}

export interface Blockquote extends Parent {
	type: Type.Blockquote
}

export interface Heading extends Parent {
	type: Type.Heading
	depth: number
}

export interface Code extends Text {
	type: Type.Code
	lang: string | null
}

export interface InlineCode extends Text {
	type: Type.InlineCode
}

export interface YAML extends Text {
	type: Type.YAML
}

export interface HTML extends Text {
	type: Type.HTML
}

export interface List extends Parent {
	type: Type.List
	ordered: boolean
	start: number | null
	loose: boolean
}

export interface ListItem extends Parent {
	type: Type.ListItem
	loose: boolean
	checked: boolean | null
}

enum AlignType {
	'left',
	'right',
	'center'
}

export interface Table extends Parent {
	type: Type.Table
	align: AlignType | null
}

export interface TableRow extends Parent {
	type: Type.TableRow
}

export interface TableCell extends Parent {
	type: Type.TableCell
}

export interface ThematicBreak extends Node {
	type: Type.ThematicBreak
}

export interface Break extends Node {
	type: Type.Break
}

export interface Emphasis extends Parent {
	type: Type.Emphasis
}

export interface Strong extends Parent {
	type: Type.Strong
}

export interface Delete extends Parent {
	type: Type.Delete
}

export interface Link extends Parent {
	type: Type.Link
	title: string | null
	url: string
}

export interface Image extends Node {
	type: Type.Image
	title: string | null
	alt: string | null
	url: string
}

export interface Footnote extends Parent {
	type: Type.Footnote
}

enum ReferenceType {
	'shortcut',
	'collapsed',
	'full'
}

export interface LinkReference extends Parent {
	type: Type.LinkReference
	identifier: string
	referenceType: ReferenceType
}

export interface ImageReference extends Node {
	type: Type.ImageReference
	identifier: string
	referenceType: ReferenceType
	alt: string | null
}

export interface FootnoteReference extends Node {
	type: Type.FootnoteReference
	identifier: string
}

export interface Definition extends Node {
	type: Type.Definition
	identifier: string
	title: string | null
	url: string
}

export interface FootnoteDefinition extends Parent {
	type: Type.FootnoteDefinition
	identifier: string
}

export interface TextNode extends Text {
	type: Type.Text
}
