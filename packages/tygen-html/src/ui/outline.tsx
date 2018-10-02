import React from 'react'
import { css, cx } from 'linaria'

export class Outline extends React.Component<{
	icon?: React.ReactNode
	header: React.ReactNode
	collapsible?: boolean
}> {
	render() {
		const { icon, header, children, collapsible } = this.props
		return (
			<div className={cx(OutlineBody, collapsible && 'collapsible')}>
				<div className={cx(OutlineIcon)}>{icon}</div>
				<div className={OutlineHeader}>{header}</div>
				{children && <div className={OutlineChildren}>{children}</div>}
			</div>
		)
	}
}

const OutlineIcon = css`
	grid-area: icon;
	align-self: center;
	justify-self: right;
`

const OutlineHeader = css`
	grid-area: header;
	align-self: center;

	> * {
		position: relative;
		top: -0.1em;
	}

	h1 {
		margin: 0;
		padding: 0;
	}

	h2 {
		margin: 0;
		padding: 0;
	}
`

const OutlineBody = css`
	position: relative;
	display: grid;
	grid-template-areas: 'icon header' 'empty children';
	grid-template-columns: 20px 1fr;
	grid-column-gap: 10px;
	margin-left: -30px;

	&.collapsible:hover {
		cursor: pointer;

		.${OutlineIcon} * {
			fill: red;
		}

		.${OutlineHeader} * {
			color: red;
		}
	}
`

const OutlineChildren = css`
	grid-area: children;
	min-width: 0;
	margin-top: 10px;
`
