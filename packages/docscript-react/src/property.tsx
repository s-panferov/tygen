import * as React from 'react'
import { PropertyReflection, ReflectionLink } from '@docscript/reflector/src/reflection'
import { BaseView, withContext } from './view'
import { css, styles } from 'linaria'
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
			<div {...styles(PropertyBody)} id={documentIdFromId(reflection.id!)}>
				<span {...styles(PropertyDef)}>
					{!compact && <Badge outline>prop</Badge>}
					<span {...styles(PropertyName)}>{reflection.name}</span>:{' '}
					{<TypeView reflection={reflection.type} />}
				</span>
				<DefinedIn origin={reflection.origin} parentId={parentId} />
				<CommentView reflection={reflection} />
			</div>
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
			<div {...styles(DefinedInBody)}>
				defined in <RefLink reflection={origin} />
			</div>
		)
	}
}

const DefinedInBody = css`
	color: #999;
	font-size: 13px;
	margin-top: 5px;
	padding-left: 15px;
`

const PropertyBody = css`
	position: relative;
	&:not(:only-child) {
		margin-bottom: 20px;
	}

	&:last-child {
		margin-bottom: 0px;
	}
`

const PropertyDef = css`
	font-family: monospace;
`

const PropertyName = css`
	color: #2e86de;
	font-weight: bold;
	font-family: monospace;
`
