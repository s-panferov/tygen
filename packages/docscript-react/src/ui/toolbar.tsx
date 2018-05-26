import React from 'react'
import styled from 'styled-components'
import { Search } from './search'
import { PackagesNav, InventoryProvider } from './packages'
import { withContext, ViewSettings } from '../view'
import { normalizePath } from '../helpers'
import { SearchReflection } from '@docscript/reflector/src/reflection/search/reflection'

export interface ToolbarProps {
	pkg?: string
	version?: string
	settings?: ViewSettings
	search?: SearchReflection
}

@withContext
export class Toolbar extends React.Component<ToolbarProps> {
	render() {
		const { pkg, version, settings, search } = this.props
		return (
			<ToolbarBlock>
				<Logo href={normalizePath(settings!, '/')}>tsdoc.io</Logo>
				<InventoryProvider>
					{iv => <PackagesNav pkg={pkg} version={version} inventory={iv} />}
				</InventoryProvider>
				<Search reflection={search} pkg={pkg} version={version} />
			</ToolbarBlock>
		)
	}
}

const Logo = styled.a`
	display: block;
	border-right: 1px solid #ccc;
	padding-left: 10px;
	padding-right: 10px;
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-size: 12px;
	color: #303952;
`

const ToolbarBlock = styled.div`
	border-bottom: 1px solid #ccc;
	height: 40px;
	display: flex;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
	z-index: 10;
	position: relative;
`
