import React from 'react'
import { Reflection } from '@tygen/reflector'
import { css } from 'linaria'
import { Join } from './ui/join'
import { hrefFromId } from './ref-link'
import { withSettings, ViewSettings } from './view'
import { normalizePath } from './helpers'

class BreadcrumbBase extends React.Component<{
	reflection: Reflection
	settings: ViewSettings
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
			<a className={LinkStyle} key={pkg[0]} href={normalizePath(settings!, pkgHref.href)}>
				{pkg[1]}
				<span className={ArrowStyle}> </span>
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
				<a className={LinkStyle} key={subId} href={normalizePath(settings!, href.href)}>
					{href.name}
					<span className={ArrowStyle}> </span>
				</a>
			)

			if (res.index >= rest.length - 1) {
				break
			}
		}

		return (
			<div className={BodyStyle}>
				<Join
					joinWith={i => (
						<span className={SepStyle} key={i}>
							/
						</span>
					)}>
					{links}
				</Join>
			</div>
		)
	}
}

export const Breadcrumb = withSettings(BreadcrumbBase)

export function createLink(...parts: string[]) {
	return '/' + parts.join('/')
}

const BodyStyle = css`
	font-size: 14px;
`
const LinkStyle = css`
	position: relative;
	display: inline;
	background-color: #ccc;
	padding-left: 15px;
	margin-left: -10px;
	line-height: 30px;
	border: 3px solid #ccc;
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
	font-size: 12px;

	&:first-child {
		padding-left: 5px;
	}

	&:first-child {
		margin-left: 0px;
	}
`

const ArrowStyle = css`
	display: inline;

	&::after {
		content: ' ';
		display: block;
		width: 0;
		height: 0;
		border-top: 11px solid transparent; /* Go big on the size, and let overflow hide */
		border-bottom: 11px solid transparent;
		border-left: 12px solid #ccc;
		position: absolute;
		transform: translateY(-50%) translateX(3px);
		margin-top: -15px;
		left: 100%;
		z-index: 2;
	}

	&::before {
		content: ' ';
		display: block;
		width: 0;
		height: 0;
		border-top: 11px solid transparent;
		border-bottom: 11px solid transparent;
		border-left: 10px solid white;
		position: absolute;
		transform: translateY(-50%) translateX(3px);
		margin-top: -15px;
		margin-left: 1px;
		left: 100%;
		z-index: 1;
	}
`

const ItemStyle = css``
const SepStyle = css`
	padding: 0 2px;
	color: #ccc;
`
