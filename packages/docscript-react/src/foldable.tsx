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
				<Plus onClick={this.onClick}>{this.state.open ? '+' : '-'}</Plus>
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
	padding-left: 18px;
	border-left: 1px solid #ccc;
	margin-bottom: 20px;
`

const Plus = styled.div`
	color: #444;
	position: absolute;
	left: -12px;
	top: -2px;
	font-size: 18px;
	display: block;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	background-color: #fff;
	border: 1px solid #ccc;
	border-radius: 50%;
	cursor: pointer;
`
