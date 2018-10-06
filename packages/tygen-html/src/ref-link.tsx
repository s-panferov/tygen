import * as React from 'react'
import cn from 'classnames'

import { Reflection, ReflectionKind } from '@tygen/reflector'
import { css, cx } from 'linaria'
import { withSettings, ViewSettings } from './view'
import { parseId, normalizePath } from './helpers'
import { TypePre } from './pre/type'
import { PrettyCode, prettyRender } from './pre/prettier'

export function hrefFromId(id: string, relativeId?: string) {
	const parts = (relativeId ? id.replace(relativeId, '') : id).split(/::|->/)
	let last = parts[parts.length - 1]
	if (last[0] === '/') {
		last = last.slice(1)
	}

	const ident = parseId(id)
	let href = `/${ident.pkg}/${ident.version}`
	if (ident.module) {
		href += '/' + ident.module.join('/')
	}

	if (ident.items) {
		let itemsPart = ''
		let file = false

		for (const item of ident.items.reverse()) {
			if (!file && item.file) {
				if (itemsPart.length > 0) {
					itemsPart = '#' + itemsPart
				}
				file = true
			}

			itemsPart =
				item.name +
				(itemsPart.length > 0 && itemsPart[0] !== '#' ? '/' + itemsPart : itemsPart)
		}

		href += '/' + itemsPart
	}

	return {
		name: last.replace(/[<>]/g, ''),
		id: last.replace(/[<>'"]/g, '_'),
		href
	}
}

export function documentIdFromId(id: string): string | undefined {
	const ident = parseId(id)

	if (ident.items) {
		let itemsPart = ''
		for (const item of ident.items.reverse()) {
			if (item.file && itemsPart.length > 0) {
				return itemsPart
			}

			itemsPart =
				item.name +
				(itemsPart.length > 0 && itemsPart[0] !== '#' ? '/' + itemsPart : itemsPart)
		}
	}
}

export function createLink(
	reflection: Reflection,
	relativeId?: string
): { name: string; href: string; id: string } {
	switch (reflection.kind) {
		case ReflectionKind.Link:
			return hrefFromId(reflection.target, relativeId)
	}

	if (reflection.id) {
		return hrefFromId(reflection.id, relativeId)
	}

	throw new Error(`Unsupported ${JSON.stringify(reflection, null, 4)}`)
}

export function navigateTo(settings: ViewSettings, refId: string) {
	const href = normalizePath(settings, hrefFromId(refId).href)
	window.location = href as any
}

export class RefLinkPre extends PrettyCode<RefLinkProps> {
	render() {
		const { relativeId, reflection, name } = this.props
		switch (reflection.kind) {
			case ReflectionKind.Type:
				return <TypePre reflection={reflection as any} />
		}

		let linkName = name || createLink(this.props.reflection, relativeId).name
		return this.id(linkName, <RefLink {...this.props} />)
	}
}

export interface RefLinkProps {
	className?: string
	reflection: Reflection
	relativeId?: string
	phantom?: boolean
	name?: string
}

class RefLink_ extends React.Component<RefLinkProps & { settings: ViewSettings }> {
	render() {
		const { relativeId, phantom, reflection, name, settings } = this.props

		if (!reflection.id) {
			switch (reflection.kind) {
				case ReflectionKind.Type:
					return prettyRender(<TypePre reflection={reflection as any} />)
			}
		}

		const { name: linkName, href } = createLink(this.props.reflection, relativeId)
		const linkNames = (name || linkName).split('/').filter(Boolean)
		const isPath = linkNames.length > 1

		const relativeHref = normalizePath(settings!, href)

		return (
			<a
				className={cx(RefLinkBody, cn({ phantom }), this.props.className)}
				href={relativeHref}>
				{this.props.children ||
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
