import React from 'react'
import styled from 'styled-components'
import cn from 'classnames'

export interface LayoutProps {
	sidebar?: React.ReactNode
}

export class Layout extends React.Component<LayoutProps> {
	render() {
		return (
			<LayoutBlock
				className={cn({
					wide: !!this.props.sidebar
				})}>
				{this.props.sidebar && <Sidebar>{this.props.sidebar}</Sidebar>}
				<Content>
					<ContentInner>{this.props.children}</ContentInner>
				</Content>
			</LayoutBlock>
		)
	}
}

const Sidebar = styled.div`
	display: block;
	grid-area: sidebar;
`

const Content = styled.div`
	grid-area: content;
	display: flex;
	align-items: center;
	margin-left: 20px;
`

const ContentInner = styled.div`
	max-width: 900px;
`

const LayoutBlock = styled.div`
	display: grid;

	grid-template-areas: 'content';
	grid-template-columns: 1fr;
	grid-template-rows: 1fr;

	&.wide {
		grid-template-areas: 'sidebar content';
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
	}
`
