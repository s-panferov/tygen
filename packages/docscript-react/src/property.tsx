import * as React from 'react'
import { PropertyReflection } from '@docscript/reflector/src/reflection'
import { BaseView } from './view'
import styled from 'styled-components'
import { Item } from './ui/item'
import { TypeView } from './type'
import { CommentView } from './comment'

export class PropertyView extends BaseView<PropertyReflection> {
	render() {
		const { reflection } = this.props

		if (!reflection.type) {
			console.error(reflection)
		}

		return (
			<Item
				name={
					<span>
						<PropertyName>{reflection.name}</PropertyName>:{' '}
						{<TypeView reflection={reflection.type} />}
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
