import { Reflection } from '@tygen/reflector/src/reflection'
import React from 'react'
import { ReflectionView } from './render'
import { PrettyCode } from './pre/prettier'

export class PropertiesViewPre extends PrettyCode<{
	properties?: Reflection[]
	parentId?: string
}> {
	render() {
		const { properties, parentId } = this.props

		if (!properties) {
			return null
		}

		const propViews = properties.map(prop => {
			return <ReflectionView key={prop.id} reflection={prop} parentId={parentId} />
		})

		return propViews
	}
}
