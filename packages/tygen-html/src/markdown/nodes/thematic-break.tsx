import * as React from 'react'
import { ThematicBreak } from '../mdast'

export namespace ThematicBreakUI {
	export interface Props {
		node: ThematicBreak
	}
}

export class ThematicBreakUI extends React.Component<ThematicBreakUI.Props, {}> {
	render() {
		return <pre />
	}
}
