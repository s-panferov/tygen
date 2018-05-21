import React from 'react'
import styled from 'styled-components'
import { Search } from '../search'

export interface ToolbarProps {
	pkg: string
	version: string
}

export class Toolbar extends React.Component<ToolbarProps> {
	render() {
		const { pkg, version } = this.props
		return (
			<ToolbarBlock>
				<Logo>tsdoc.io</Logo>
				<Package>{pkg}</Package>
				<Version>{version}</Version>
				<Search pkg={pkg} version={version} />
			</ToolbarBlock>
		)
	}
}

const Package = styled.div`
	border-right: 1px solid #ccc;
	padding: 0 10px;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: bold;
	color: #555;
`

const Version = styled.div`
	border-right: 1px solid #ccc;
	padding: 0 10px;
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #555;
`

const Logo = styled.div`
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
`
