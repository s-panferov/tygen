import * as React from 'react'
import { PropertyReflection } from '@docscript/reflector/src/reflection'
import { BaseView } from './view'
import styled from 'styled-components'
import { TypeView } from './type'
import { CommentView } from './comment'
import { NavItem } from './ui/nav'
import { documentIdFromId, RefLink } from './ref-link'
import { Badge } from './ui/badge'

export class PropertyView extends BaseView<PropertyReflection> {
	render() {
		const { reflection, nav } = this.props

		if (nav) {
			return (
				<NavItem>
					<RefLink reflection={reflection} phantom />
				</NavItem>
			)
		}

		return (
			<PropertyBody id={documentIdFromId(reflection.id!)}>
				<PropertyDef>
					<Badge outline>prop</Badge>
					<PropertyName>{reflection.name}</PropertyName>:{' '}
					{<TypeView reflection={reflection.type} />}
				</PropertyDef>
				<CommentView reflection={reflection} />
			</PropertyBody>
		)
	}
}

const PropertyBody = styled.div`
	position: relative;
	margin-bottom: 20px;
`

const PropertyDef = styled.span`
	font-family: monospace;
`

const PropertyName = styled.span`
	color: #2e86de;
	font-weight: bold;
	font-family: monospace;
`
