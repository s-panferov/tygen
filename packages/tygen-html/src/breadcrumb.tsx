import React from 'react'
import { Reflection } from '@tygen/reflector'
import { css, styles } from 'linaria'
import { Join } from './ui/join'
import { hrefFromId } from './ref-link'
import { withContext, ViewSettings } from './view'
import { normalizePath } from './helpers'

@withContext
export class Breadcrumb extends React.Component<{
	reflection: Reflection
	settings?: ViewSettings
}> {
	render() {
		const { reflection, settings } = this.props
		const { id } = reflection

		if (!id) {
			return
		}

		const links = [] as React.ReactNode[]
		const regexp = /(->|::|\/|$)/g
		const pkg = id.match(/(.*?)->(.*?)(->|$)/)!
		const pkgHref = hrefFromId(pkg[0])

		links.push(
			<a
				{...styles(BreadcrumbLink)}
				key={pkg[0]}
				href={normalizePath(settings!, pkgHref.href)}>
				{pkg[1]}
			</a>
		)

		let rest = id.slice(pkg[0].length)
		let lastRef: string = pkg[0]

		let res: RegExpExecArray | null
		while ((res = regexp.exec(rest))) {
			if (res.index === 0) {
				break
			}

			// package always goes with a version
			let subId = pkg[0] + rest.slice(0, res.index)

			const href = hrefFromId(subId, lastRef)
			lastRef = subId

			links.push(
				<a
					{...styles(BreadcrumbLink)}
					key={subId}
					href={normalizePath(settings!, href.href)}>
					{href.name}
				</a>
			)

			if (res.index >= rest.length - 1) {
				break
			}
		}

		return (
			<div {...styles(BreadcrumbBody)}>
				<Join
					joinWith={i => (
						<span {...styles(BreadcrumbSep)} key={i}>
							/
						</span>
					)}>
					{links}
				</Join>
			</div>
		)
	}
}

export function createLink(...parts: string[]) {
	return '/' + parts.join('/')
}

const BreadcrumbBody = css`
	font-size: 14px;
	margin-bottom: var(--items-space);
	margin-top: -10px;
`
const BreadcrumbLink = css``
const BreadcrumbSep = css`
	padding: 0 2px;
	color: #ccc;
`
