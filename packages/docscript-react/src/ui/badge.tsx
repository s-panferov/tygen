import React from 'react'
import styled from 'styled-components'

export interface BadgeProps {}

export class Badge extends React.Component<BadgeProps> {
	render() {
		return <BadgeBlock>{this.props.children}</BadgeBlock>
	}
}

const BadgeBlock = styled.span`
	font-size: 0.7em;
	border-radius: 10px;
	white-space: nowrap;
	padding: 2px 5px;
	vertical-align: middle;
	background-color: #786fa6;
	color: #fff;
`
