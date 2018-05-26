import React from 'react'
import styled from 'styled-components'
import fs from 'fs'

export interface FoldableProps {
	title: React.ReactNode
}

export interface FoldableState {
	open: boolean
}

if (typeof btoa === 'undefined') {
	;(global as any).btoa = function(str) {
		return new Buffer(str, 'binary').toString('base64')
	}
}

if (typeof atob === 'undefined') {
	;(global as any).atob = function(b64Encoded) {
		return new Buffer(b64Encoded, 'base64').toString('binary')
	}
}

const Expand = `data:image/svg+xml;base64,${btoa(
	fs.readFileSync('asset/expand-button.svg').toString()
)}`

const Collapse = `data:image/svg+xml;base64,${btoa(
	fs.readFileSync('asset/expand-arrow.svg').toString()
)}`

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
