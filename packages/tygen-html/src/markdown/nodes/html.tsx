import * as React from 'react'
import { HTML } from '../mdast'

export namespace HtmlUI {
	export interface Props {
		node: HTML
	}
}

export class HtmlUI extends React.Component<HtmlUI.Props, {}> {
	render() {
		const { node } = this.props
		return <pre>{node.value}</pre>
	}
}
