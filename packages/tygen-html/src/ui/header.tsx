import React from 'react'
import { css } from 'linaria'
import { Search } from './search'
import { SearchReflection } from '@tygen/reflector'
import { NormalizedLink } from '../ref-link'

export interface HeaderProps {
	pkg?: string
	version?: string
	search?: SearchReflection
}

export class Header extends React.Component<HeaderProps> {
	render() {
		const { search } = this.props
		return (
			<div className={HeaderStyle}>
				<div className={HeaderInner}>
					<Logo />
					<Search reflection={search} />
					<Discussion />
				</div>
			</div>
		)
	}
}

export function Logo() {
	return (
		<NormalizedLink className={LogoStyle} href={''}>
			<img src={require('../../asset/logo.png')} width={70} />
		</NormalizedLink>
	)
}

import PackageIcon from '@fortawesome/fontawesome-free/svgs/solid/comments.svg'
import { Icon } from './icon'

export function Discussion() {
	return (
		<a href={'https://talk.tsdoc.io'}>
			<Icon width={20} height={20} sym={PackageIcon} />
		</a>
	)
}

const LogoStyle = css`
	display: block;
	padding-left: 40px;
	padding-right: 10px;
	font-weight: bold;
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-size: 12px;
	color: #303952;
`

const HeaderInner = css`
	width: 100vw;
	max-width: 1118px;
	display: flex;
	align-items: center;
`

const HeaderStyle = css`
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	height: 40px;
	display: flex;
	/* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08); */
	z-index: 10;
	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;

	padding-right: 25px;
	box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.05);
`
