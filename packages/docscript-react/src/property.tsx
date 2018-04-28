import * as React from 'react'
import { PropertyReflection } from '@docscript/reflector/src/reflection'
import { BaseView } from './view'
import styled from 'styled-components'
import { Item } from './ui/item'
import { TypeView } from './type'
import { CommentView } from './comment'
import { NavItem } from './ui/nav'
import { hrefFromId, documentIdFromId } from './ref-link'

export class PropertyView extends BaseView<PropertyReflection> {
	render() {
		const { reflection, nav } = this.props

		if (nav) {
			return <NavItem href={hrefFromId(reflection.id!).href}>{reflection.name}</NavItem>
		}

		return (
			<Item
				name={
					<span>
						<PropertyName id={documentIdFromId(reflection.id!)}>
							{reflection.name}
						</PropertyName>: {<TypeView reflection={reflection.type} />}
					</span>
				}>
				<CommentView reflection={reflection} />
			</Item>
		)
	}
}

const PropertyName = styled.span`
	color: #2e86de;
`
