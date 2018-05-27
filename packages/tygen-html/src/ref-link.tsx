import * as React from 'react'
import cn from 'classnames'

import { Reflection, ReflectionKind } from '@tygen/reflector/src/reflection'
import { css, styles } from 'linaria'
import { BaseView, withContext, ViewSettings } from './view'
import { parseId, normalizePath } from './helpers'
import { TypeView } from './type'

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
				(itemsPart.length > 0 && itemsPart['0'] !== '#' ? '/' + itemsPart : itemsPart)
		}

		href += '/' + itemsPart
	}

	return {
		name: last.replace(/[<>]/g, ''),
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
				(itemsPart.length > 0 && itemsPart['0'] !== '#' ? '/' + itemsPart : itemsPart)
		}
	}
}

function createLink(reflection: Reflection, relativeId?: string): { name: string; href: string } {
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

@withContext
export class RefLink extends BaseView<
	Reflection,
	{ relativeId?: string; phantom?: boolean; name?: string; settings?: ViewSettings }
> {
	render() {
		const { relativeId, phantom, reflection, name, settings } = this.props

		switch (reflection.kind) {
			case ReflectionKind.Type:
				return <TypeView reflection={reflection as any} />
		}

		const { name: linkName, href } = createLink(this.props.reflection, relativeId)

		const names = (name || linkName).split('/').filter(Boolean)
		const isPath = names.length > 1

		const relativeHref = normalizePath(settings!, href)

		return (
			<a {...styles(RefLinkBody, cn({ phantom }))} href={relativeHref}>
				{this.props.children ||
					names.map((name, i) => {
						return (
							<span
								key={name}
								{...styles(Name, cn({ main: !isPath || i === names.length - 1 }))}>
								{name}
								{i !== names.length - 1 ? '/' : ''}
							</span>
						)
					})}
			</a>
		)
	}
}

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
