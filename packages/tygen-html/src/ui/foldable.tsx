import React from 'react'
import { css } from 'linaria'

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
			<div className={FoldableBlock}>
				<div className={FoldableTitle}>
					<div className={Plus} onClick={this.onClick}>
						{this.state.open ? (
							<img className={Icon} src={Expand} />
						) : (
							<img className={Icon} src={Collapse} />
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
