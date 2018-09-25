import React from 'react'
import { css } from 'linaria'
import { Search } from './search'
import { PackagesNav, InventoryProvider } from './packages'
import { withSettings, ViewSettings } from '../view'
import { normalizePath } from '../helpers'
import { SearchReflection } from '@tygen/reflector/src/reflection/search/reflection'

export interface ToolbarProps {
	pkg?: string
	version?: string
	settings?: ViewSettings
	search?: SearchReflection
}

export class Toolbar extends React.Component<ToolbarProps> {
	render() {
		const { pkg, version, search } = this.props
		return (
			<div className={BodyStyle}>
				<div className={BodyInner}>
					<Logo />
					{/* <InventoryProvider>
					{iv => <PackagesNav pkg={pkg} version={version} inventory={iv} />}
				</InventoryProvider> */}
					<Search reflection={search} pkg={pkg} version={version} />
				</div>
			</div>
		)
	}
}

export function LogoBase({ settings }: { settings: ViewSettings }) {
	return (
		<a className={LogoStyle} href={normalizePath(settings!, '/')}>
			<img src={require('../../asset/logo.png')} width={70} />
		</a>
	)
}

export const Logo = withSettings(LogoBase)

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

const BodyInner = css`
	width: 100vw;
	max-width: 1118px;
	display: flex;
	align-items: center;
`

const BodyStyle = css`
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

	box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.05);
`
