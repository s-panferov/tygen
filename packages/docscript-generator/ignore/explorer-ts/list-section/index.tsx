import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import SmartLink from '../../explorer/components/smart-link'

import { Ref } from '../../doc'
import { ItemType } from '../../doc/items'

require('./index.css')
const block = theme.block('ts-list-section')

export enum ListSectionView {
	Column = 'column' as any,
	Row = 'row' as any
}

export interface ListSectionProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	itemType: string
	items: [Ref, string][]
	view?: ListSectionView
}

export interface ListSectionState {}

const NameMapping = {
	[ItemType.Interface]: 'Interfaces',
	[ItemType.Class]: 'Classes',
	[ItemType.TypeAlias]: 'Type aliases',
	[ItemType.Function]: 'Functions',
	[ItemType.EnumDeclaration]: 'Enums',
	[ItemType.VariableDeclaration]: 'Variables'
}

export default class ListSection extends React.Component<ListSectionProps, ListSectionState> {
	static contextTypes = theme.themeContext
	static defaultProps = {
		view: ListSectionView.Column
	}

	getClassName() {
		return block(theme.resolveTheme(this), {
			view: this.props.view
		}).mix(this.props.className)
	}

	render() {
		return (
			<div className={this.getClassName()}>
				<div className={block('heading')}>{NameMapping[this.props.itemType]}</div>
				<div className={block('items')}>
					{this.props.items.map(item => {
						let [selfRef, name] = item
						return (
							<SmartLink key={selfRef.id} className={block('item')} route={selfRef}>
								{name}
							</SmartLink>
						)
					})}
				</div>
			</div>
		)
	}
}
