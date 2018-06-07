import * as React from 'react'
import { Table } from '../mdast'

export namespace TableUI {
	export interface Props {
		node: Table
	}
}

export class TableUI extends React.Component<TableUI.Props, {}> {
	render() {
		return <pre />
	}
}
