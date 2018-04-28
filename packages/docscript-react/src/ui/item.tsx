import React from 'react'
import styled from 'styled-components'
import { Badge } from './badge'

export interface ItemProps {
	name: React.ReactNode
	badge?:
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
		| string
}

export interface ItemState {
	open: boolean
}

export class ItemSignature extends React.Component {
	render() {
		const { children } = this.props
		return <ItemSignatureBody>{children}</ItemSignatureBody>
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
			<ItemBlock>
				<ItemHeader onClick={this.onClick}>
					{badge && <Badge>{badge}</Badge>}
					<ItemName>{name}</ItemName>
				</ItemHeader>
				{open && children}
			</ItemBlock>
		)
	}

	onClick = () => {
		this.setState(state => ({
			open: !state.open
		}))
	}
}

const ItemHeader = styled.div`
	display: flex;

	padding: 5px 0px;
`

const ItemBlock = styled.div`
	position: relative;
	& + & {
		margin-top: 10px;
	}
`

const ItemName = styled.div`
	position: relative;
	font-family: monospace;
`

const ItemSignatureBody = styled.div`
	padding: 5px;
	font-family: monospace;
	background-color: #f5f5f5;
`
