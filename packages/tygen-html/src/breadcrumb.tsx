import React from 'react'
import { Reflection } from '@tygen/reflector'
import { css, cx } from 'linaria'
import { hrefFromId } from './ref-link'
import { withSettings, ViewSettings } from './view'
import { normalizePath } from './helpers'

import homeIcon from '@fortawesome/fontawesome-free/svgs/solid/home.svg'

class BreadcrumbBase extends React.Component<{
	reflection: Reflection
	settings: ViewSettings
}> {
	render() {
		const { reflection, settings } = this.props
		const { id } = reflection

		if (!id) {
			return null
		}

		const links = [] as React.ReactNode[]
		const regexp = /(->|::|\/|$)/g
		const pkg = id.match(/(.*?)->(.*?)(->|$)/)!
		const pkgHref = hrefFromId(pkg[0])

		links.push(
			<a
				className={cx(LinkStyle, HomeLinkStyle)}
				key="__home"
				href={normalizePath(settings!, '/')}>
				<svg
					viewBox={homeIcon.viewBox}
					className={HomeIconStyle}
					width={15}
					height={15}
					style={{ color: '#fff' }}>
					<use href={'#' + homeIcon.id} />
				</svg>
				<span className={ArrowStyle}> </span>
			</a>
		)

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

		return <div className={BodyStyle}>{links}</div>
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
	--color: #5995ed;

	font-size: 12px;

	position: relative;
	display: inline;
	background-color: var(--color);
	padding-left: 15px;
	margin-left: 0px;
	border-top: 2px solid var(--color);
	border-bottom: 3px solid var(--color);
	border-left: 3.2px solid var(--color);
	border-right: 3.2px solid var(--color);
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;

	color: #fff !important;
	font-weight: light;
	font-family: 'Source Sans Pro';

	transition: 0.5s all ease;

	&:hover {
		--color: #0064c9;
		color: #fff !important;
	}

	&:first-child {
		padding-left: 5px;
	}

	&:first-child {
		margin-left: 0px;
	}

	& + & {
		border-left: 0;
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
`

const HomeIconStyle = css`
	display: inline;
	position: relative;
	top: 3px;
	left: 2px;

	& > * {
		fill: #fff;
	}
`

const HomeLinkStyle = css`
	--color: rgb(119, 198, 239);
`

const ArrowStyle = css`
	display: inline;

	&::after {
		content: ' ';
		display: block;
		width: 0;
		height: 0;
		border-top: 10px solid transparent; /* Go big on the size, and let overflow hide */
		border-bottom: 10px solid transparent;
		border-left: 12px solid var(--color);
		position: absolute;
		transform: translateY(-50%) translateX(2.6px);
		margin-top: -6.3px;
		left: 100%;
		z-index: 2;

		transition: 0.5s all ease;
	}

	&::before {
		content: ' ';
		display: block;
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 12px solid white;
		position: absolute;
		transform: translateY(-50%) translateX(2.6px);
		margin-top: -6.3px;
		margin-left: 1px;
		left: 100%;
		z-index: 1;

		transition: 0.5s all ease;
	}
`
