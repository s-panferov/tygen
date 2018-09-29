import React from 'react'
import { css, cx } from 'linaria'
import cn from 'classnames'
import { Header } from './header'
import { Reflection } from '@tygen/reflector'
import { Tree, TreeNavigation } from './tree'
import { createStructure, Structure } from './structure'
import { Breadcrumb } from '../breadcrumb'

export interface LayoutProps {
	sidebar?: React.ReactNode
	breadcrumb?: React.ReactNode
	header?: React.ReactNode
}

export class Layout extends React.Component<LayoutProps> {
	render() {
		return (
			<div
				className={cx(
					LayoutBlock,
					cn({
						wide: !!this.props.sidebar
					})
				)}>
				<div key="breadcrumb" className={BreadcrumbStyle}>
					{this.props.breadcrumb}
				</div>
				<div key="header" className={HeaderStyle}>
					{this.props.header}
				</div>
				{this.props.sidebar && (
					<div key="sidebar" className={Sidebar}>
						{this.props.sidebar}
					</div>
				)}
				<div key="content" className={Content}>
					<div className={ContentInner}>{this.props.children}</div>
				</div>
			</div>
		)
	}
}

export class PageBody extends React.Component {
	render() {
		return <div className={PageBodyStyle}>{this.props.children}</div>
	}
}

export class Page extends React.Component<{ reflection: Reflection; header: React.ReactChild }> {
	tree = new Tree(createStructure(this.props.reflection))
	treeNavigation = new TreeNavigation(this.tree)

	render() {
		const { reflection } = this.props

		const structure = <Structure tree={this.tree} nav={this.treeNavigation} />

		return (
			<PageBody>
				<Header />
				<Layout
					sidebar={structure}
					breadcrumb={<Breadcrumb reflection={reflection} />}
					header={this.props.header}>
					{this.props.children}
				</Layout>
			</PageBody>
		)
	}
}

const PageBodyStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const BreadcrumbStyle = css`
	grid-area: breadcrumb;
	margin-left: 40px;
	margin-top: 15px;
`

const HeaderStyle = css`
	grid-area: header;
	margin-left: 40px;
	margin-top: 25px;
	margin-bottom: 20px;

	font-family: 'Source Sans Pro';
`

const Sidebar = css`
	display: flex;
	flex-direction: column;
	grid-area: sidebar;
	/* padding-top: 10px; */
	/* margin-top: -10px; */
	margin-right: 20px;
	min-width: 250px;
	margin-top: 25px;
`

const Content = css`
	grid-area: content;
	margin-left: 40px;
	margin-bottom: 50px;
	margin-right: 20px;

	min-width: 0;
`

const ContentInner = css``

const LayoutBlock = css`
	max-width: 1118px;
	width: 100vw;

	&.wide {
		display: grid;
		grid-template-areas: 'breadcrumb breadcrumb' 'header sidebar' 'content sidebar';
		grid-template-columns: 1fr auto;
		grid-template-rows: min-content min-content 1fr;

		@media (max-width: 600px) {
			grid-template-areas: 'breadcrumb' 'header' 'sidebar' 'content';
			grid-template-columns: 1fr;
			grid-template-rows: min-content;

			.${Sidebar} {
				margin-left: 40px;
				margin-bottom: 20px;
				margin-top: 0;
			}
		}
	}

	&.narrow {
		display: flex;
		justify-content: center;
	}
`
