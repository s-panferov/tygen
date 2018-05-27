import React from 'react'
import { css, styles } from 'linaria'
import cn from 'classnames'

export interface BadgeProps {
	outline?: boolean
}

export class Badge extends React.Component<BadgeProps> {
	render() {
		const { outline } = this.props
		return <span {...styles(BadgeBlock, cn({ outline }))}>{this.props.children}</span>
	}
}

const BadgeBlock = css`
	font-size: 0.7em;
	border-radius: 10px;
	white-space: nowrap;
	padding: 2px 5px;
	vertical-align: middle;
	background-color: #786fa6;
	color: #fff;

	&.outline {
		position: absolute;
		margin-left: -10px;
		top: 1px;
		transform: translateX(-100%); // ^2,3
	}
`
