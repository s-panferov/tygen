import * as React from 'react'
import { PropertyReflection, ReflectionLink } from '@docscript/reflector/src/reflection'
import { BaseView, withContext } from './view'
import styled from 'styled-components'
import { TypeView } from './type'
import { CommentView } from './comment'
import { NavItem } from './ui/nav'
import { documentIdFromId, RefLink } from './ref-link'
import { Badge } from './ui/badge'

@withContext
export class PropertyView extends BaseView<PropertyReflection, { parentId?: string }> {
	render() {
		const { reflection, settings, parentId } = this.props
		const { nav, compact } = settings!

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
					{!compact && <Badge outline>prop</Badge>}
					<PropertyName>{reflection.name}</PropertyName>:{' '}
					{<TypeView reflection={reflection.type} />}
				</PropertyDef>
				<DefinedIn origin={reflection.origin} parentId={parentId} />
				<CommentView reflection={reflection} />
			</PropertyBody>
		)
	}
}

export class DefinedIn extends React.Component<{ origin?: ReflectionLink; parentId?: string }> {
	render() {
		const { origin, parentId } = this.props

		if (!origin || origin.target === parentId) {
			return null
		}

		return (
			<div>
				defined in <RefLink reflection={origin} />
			</div>
		)
	}
}

const PropertyBody = styled.div`
	position: relative;
	&:not(:only-child) {
		margin-bottom: 20px;
	}

	&:last-child {
		margin-bottom: 0px;
	}
`

const PropertyDef = styled.span`
	font-family: monospace;
`

const PropertyName = styled.span`
	color: #2e86de;
	font-weight: bold;
	font-family: monospace;
`
