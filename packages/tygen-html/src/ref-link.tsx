import * as React from 'react'
import cn from 'classnames'

import { Reflection, ReflectionId, ReflectionPath, ReflectionKind } from '@tygen/reflector'
import { css, cx } from 'linaria'
import { withSettings, ViewSettings } from './view'
import { normalizePath } from './helpers'
import { PrettyCode } from './pre/prettier'

export function navigateTo(settings: ViewSettings, id: ReflectionId) {
	const href = normalizePath(settings, id.fileName) + '#' + id.anchor
	window.location = href as any
}

export interface PreparedLink {
	name: string
	href: string
}

function getReflectionId(input: Reflection | ReflectionId | ReflectionPath): ReflectionId {
	let id: ReflectionId | ReflectionPath
	let reflection = input as Reflection
	if (reflection.id) {
		id = reflection.id
	} else if (
		reflection.kind === ReflectionKind.Link ||
		reflection.kind == ReflectionKind.NotIncluded
	) {
		id = reflection.target
	} else {
		id = input as ReflectionId | ReflectionPath
	}
	const lastId = Array.isArray(id) ? id[id.length - 1] : id
	return lastId
}

export function getKey(
	input: Reflection | ReflectionId | ReflectionPath | undefined
): string | undefined {
	if (!input) {
		return undefined
	}
	return getReflectionId(input).anchor
}

export function formatLink(id: Reflection | ReflectionId | ReflectionPath): PreparedLink {
	const lastId = getReflectionId(id)
	return {
		href: '/' + lastId.fileName + '#' + lastId.anchor,
		name: lastId.name
	}
}

export class RefLinkPre extends PrettyCode<RefLinkProps> {
	render() {
		const { reflection, reflectionId, preparedLink, name } = this.props
		const idFrom = reflection || reflectionId
		const link = preparedLink || (idFrom ? formatLink(idFrom) : undefined)
		if (!link) {
			throw new Error('Cannot build a link for a reflection without an Id')
		}

		const linkName = name || link.name
		return this.id(linkName, <RefLink {...this.props} />)
	}
}

export interface RefLinkProps {
	className?: string
	reflection?: Reflection
	reflectionId?: ReflectionPath | ReflectionId
	relativeId?: ReflectionPath | ReflectionId
	preparedLink?: PreparedLink
	phantom?: boolean
	name?: string
	children?: React.ReactElement<any> | ((link: PreparedLink) => React.ReactChild)
}

class RefLink_ extends React.Component<RefLinkProps & { settings: ViewSettings }> {
	render() {
		const { phantom, reflection, name, settings, reflectionId, preparedLink } = this.props

		const idFrom = reflection || reflectionId
		const link = preparedLink || (idFrom ? formatLink(idFrom) : undefined)

		if (!link) {
			console.error(idFrom, preparedLink)
			throw new Error('Cannot build a link for a reflection without an Id')
		}

		const { name: linkName, href } = link
		const linkNames = (name || linkName).split('/').filter(Boolean)
		const isPath = linkNames.length > 1

		const relativeHref = normalizePath(settings, href)

		return (
			<a
				className={cx(RefLinkBody, cn({ phantom }), this.props.className)}
				href={relativeHref}>
				{typeof this.props.children === 'function'
					? this.props.children(link)
					: this.props.children ||
					  linkNames.map((name, i) => {
							return (
								<span
									key={name}
									className={cx(
										Name,
										cn({ main: !isPath || i === linkNames.length - 1 })
									)}>
									{name}
									{i !== linkNames.length - 1 ? '/' : ''}
								</span>
							)
					  })}
			</a>
		)
	}
}

export const RefLink = withSettings(RefLink_)

const Name = css`
	color: #ccc;
	&.main {
		color: inherit;
	}
`

const RefLinkBody = css`
	overflow: hidden;
	text-overflow: ellipsis;

	&.phantom {
		text-decoration: none;
	}
`
