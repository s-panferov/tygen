import * as React from 'react'
import { PropertyReflection } from '@docscript/reflector/src/reflection'
import { ReflectionView } from './view'
import styled from 'styled-components'
import { Item } from './ui/item'
import { TypeView } from './type'
import { CommentView } from './comment'

export class PropertyView extends ReflectionView<PropertyReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Item
				name={
					<span>
						{reflection.name}: {<TypeView reflection={reflection.type} />}
					</span>
				}>
				<CommentView reflection={reflection} />
			</Item>
		)
	}
}
