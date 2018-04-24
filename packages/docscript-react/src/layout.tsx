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
	display: flex;
	flex-direction: column;
	grid-area: sidebar;
	min-width: 200px;
	padding: 20px 10px;
`

const Content = styled.div`
	grid-area: content;
	margin-left: 20px;
`

const ContentInner = styled.div`
	max-width: 900px;
`

const LayoutBlock = styled.div`
	display: flex;
	justify-content: center;

	&.wide {
		display: grid;
		grid-template-areas: 'sidebar content';
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
	}
`
