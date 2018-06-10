import React from 'react'
import { css, styles } from 'linaria'
import cn from 'classnames'

export interface LayoutProps {
	sidebar?: React.ReactNode
}

export class Layout extends React.Component<LayoutProps> {
	render() {
		return (
			<div
				{...styles(
					LayoutBlock,
					cn({
						wide: !!this.props.sidebar
					})
				)}>
				{this.props.sidebar && <div {...styles(Sidebar)}>{this.props.sidebar}</div>}
				<div {...styles(Content)}>
					<div {...styles(ContentInner)}>{this.props.children}</div>
				</div>
			</div>
		)
	}
}

const Sidebar = css`
	display: flex;
	flex-direction: column;
	grid-area: sidebar;
	width: 250px;
	padding: 20px 10px 20px 20px;
	min-height: calc(100vh - 40px);
`

const Content = css`
	grid-area: content;
	margin-left: 60px;
	margin-bottom: 50px;
`

const ContentInner = css`
	max-width: 900px;
`

const LayoutBlock = css`
	display: flex;
	justify-content: center;

	&.wide {
		display: grid;
		grid-template-areas: 'sidebar content';
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
	}
`
