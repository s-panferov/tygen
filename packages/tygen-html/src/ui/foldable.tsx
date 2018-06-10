import React from 'react'
import { css, styles } from 'linaria'
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
			<div {...styles(FoldableBlock)}>
				<div {...styles(FoldableTitle)}>
					<div {...styles(Plus)} onClick={this.onClick}>
						{this.state.open ? (
							<img {...styles(Icon)} src={Expand} />
						) : (
							<img {...styles(Icon)} src={Collapse} />
						)}
					</div>
					{this.props.title}
				</div>
				{this.state.open && this.props.children}
			</div>
		)
	}

	onClick = () => {
		this.setState(state => ({
			open: !state.open
		}))
	}
}

const FoldableBlock = css`
	position: relative;
`

const FoldableTitle = css`
	display: flex;
	align-items: center;

	& h1,
	& h2,
	& h3,
	& h4,
	& h5 {
		padding: 0;
		margin: 0;
	}
`

const Plus = css``

const Icon = css`
	position: relative;
	left: -10px;
	width: 0.8em;
	height: 0.8em;
	border: 0px solid transparent;
	cursor: pointer;
	margin-left: calc(-1em - 0px);
`
