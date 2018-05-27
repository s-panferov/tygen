import React from 'react'
import { css, styles } from 'linaria'
import { Badge } from './badge'

export interface ItemProps {
	name: React.ReactNode
	badge?: string
}

export interface ItemState {
	open: boolean
}

export class ItemSignature extends React.Component {
	render() {
		const { children } = this.props
		return <div {...styles(ItemSignatureBody)}>{children}</div>
	}
}

export class Item extends React.Component<ItemProps, ItemState> {
	static Signature = ItemSignature

	state: ItemState = {
		open: true
	}

	render() {
		const { children, name, badge } = this.props
		const { open } = this.state
		return (
			<div {...styles(ItemBlock)}>
				<div {...styles(ItemHeader)} onClick={this.onClick}>
					{badge && <Badge>{badge}</Badge>}
					<div {...styles(ItemName)}>{name}</div>
				</div>
				{open && children}
			</div>
		)
	}

	onClick = () => {
		this.setState(state => ({
			open: !state.open
		}))
	}
}

const ItemHeader = css`
	display: flex;

	padding: 5px 0px;
`

const ItemBlock = css`
	position: relative;
	& + & {
		margin-top: 10px;
	}
`

const ItemName = css`
	position: relative;
	font-family: monospace;
`

const ItemSignatureBody = css`
	padding: 5px;
	font-family: monospace;
	background-color: #f5f5f5;
`
