import React from 'react'
import styled from 'styled-components'

export interface FoldableProps {
	title: React.ReactNode
}

export interface FoldableState {
	open: boolean
}

const Expand = require('../../asset/expand-button.svg')
const Collapse = require('../../asset/expand-arrow.svg')

export class Foldable extends React.Component<FoldableProps, FoldableState> {
	state: FoldableState = {
		open: true
	}

	render() {
		return (
			<FoldableBlock>
				<FoldableTitle>
					<Plus onClick={this.onClick}>
						{this.state.open ? <Icon src={Expand} /> : <Icon src={Collapse} />}
					</Plus>
					{this.props.title}
				</FoldableTitle>
				{this.state.open && this.props.children}
			</FoldableBlock>
		)
	}

	onClick = () => {
		this.setState(state => ({
			open: !state.open
		}))
	}
}

const FoldableBlock = styled.div`
	position: relative;
`

const FoldableTitle = styled.div`
	display: flex;
	align-items: center;
`

const Plus = styled.div``

const Icon = styled.img`
	position: relative;
	left: -10px;
	width: 0.8em;
	height: 0.8em;
	border: 0px solid transparent;
	cursor: pointer;
	margin-left: calc(-1em - 0px);
`
