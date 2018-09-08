import React from 'react'
import { css } from 'linaria'

export class NavSection extends React.Component<{ heading: React.ReactNode }> {
	render() {
		return (
			<div className={NavSectionBlock}>
				<div className={NavSectionHeader}>{this.props.heading}</div>
				{this.props.children}
			</div>
		)
	}
}

const NavSectionBlock = css``

const NavSectionHeader = css`
	text-transform: uppercase;
	color: #444;
	font-size: 14px;
	font-weight: bold;

	margin-bottom: 10px;
`

export class NavItem extends React.Component {
	render() {
		return <div className={NavItemBlock}>{this.props.children}</div>
	}
}

const NavItemBlock = css`
	margin-bottom: 5px;
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`

export interface NavProps {}

export class Nav extends React.Component<NavProps> {
	static Section = NavSection
	static Item = NavItem

	render() {
		return <div className={NavBlock}>{this.props.children}</div>
	}
}

const NavBlock = css`
	display: flex;
	flex-direction: column;
`
