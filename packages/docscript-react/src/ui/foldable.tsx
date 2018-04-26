import React from 'react'
import styled from 'styled-components'

export interface FoldableProps {
	title: React.ReactNode
}

export interface FoldableState {
	open: boolean
}

export class Foldable extends React.Component<FoldableProps, FoldableState> {
	state: FoldableState = {
		open: true
	}

	render() {
		return (
			<FoldableBlock>
				<Plus onClick={this.onClick}>{this.state.open ? '-' : '+'}</Plus>
				{this.props.title}
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

const Plus = styled.div`
	color: #ccc;
	position: absolute;
	left: -20px;
	top: -2px;
	font-size: 18px;
	display: block;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`
