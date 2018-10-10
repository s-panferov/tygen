import React from 'react'
import path from 'path'
import { css } from 'linaria'

import { ViewSettings } from '../view'
import { NotScrollable } from './search'
import { normalizePath } from '../helpers'
import { InventoryReflection } from '@tygen/reflector'

export interface InventoryProviderState {
	inventory?: InventoryReflection
}

export class InventoryProvider extends React.Component<
	{
		settings?: ViewSettings
		children: (inventory?: InventoryReflection) => React.ReactNode
	},
	InventoryProviderState
> {
	state: InventoryProviderState = {}

	componentDidMount() {
		if (window.location.protocol === 'file:') {
			return
		}

		fetch(path.join(this.props.settings!.contextRoot, 'index.json'))
			.then(res => res.json())
			.then((inventory: InventoryReflection) => {
				this.setState({ inventory })
			})
	}

	render() {
		return this.props.children(this.state.inventory)
	}
}

export interface PackagesState {
	open?: boolean
}

export class PackagesNav extends React.Component<
	{
		pkg?: string
		version?: string
		inventory?: InventoryReflection
	},
	PackagesState
> {
	state: PackagesState = {}
	render() {
		const { inventory, pkg, version } = this.props
		return (
			<div className={InventoryBody} onClick={this.onClick}>
				<div className={Package}>
					{pkg}
					{version ? ' ' + version : null}
				</div>
				{this.state.open &&
					inventory && (
						<div className={InventoryWindow}>
							<NotScrollable />
							<PackageList inventory={inventory} />
						</div>
					)}
			</div>
		)
	}

	onClick = () => {
		if (!this.props.inventory) {
			return
		}

		this.setState(state => ({
			open: !state.open
		}))
	}
}

export class PackageList extends React.Component<{
	inventory: InventoryReflection
	settings?: ViewSettings
}> {
	render() {
		const { inventory, settings } = this.props
		return (
			<div>
				{inventory.packages.map(pkg => {
					const href = normalizePath(
						settings!,
						hrefFromId(`${pkg.name}->${pkg.versions[0]}`).href
					)
					return (
						<div className={PackageRow} key={pkg.name}>
							<a className={PackageRowName} href={href}>
								{pkg.name}
							</a>
							{pkg.versions.length > 1 && (
								<div className={PackageRowVersions}>
									{pkg.versions.map(ver => {
										const href = normalizePath(
											settings!,
											hrefFromId(`${pkg.name}->${ver}`).href
										)
										return (
											<a className={PackageRowVersion} key={ver} href={href}>
												{ver}
											</a>
										)
									})}
								</div>
							)}
						</div>
					)
				})}
			</div>
		)
	}
}

const PackageRow = css`
	padding: 5px 10px;
	&:nth-child(even) {
		background-color: #f5f5f5;
	}
`
const PackageRowName = css`
	font-size: 14px;
	display: block;
`

const PackageRowVersions = css`
	margin-top: 10px;
`

const PackageRowVersion = css`
	font-size: 12px;
`

const InventoryBody = css`
	display: flex;
	cursor: pointer;
	position: relative;
	&:hover {
		background-color: #eee;
	}
`

const InventoryWindow = css`
	left: -1px;
	position: absolute;
	top: 40px;
	height: calc(100vh - 40px);
	min-width: 100%;
	background-color: #fff;
	z-index: 2;
	overflow: scroll;
	box-sizing: border-box;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
`

const Package = css`
	border-right: 1px solid #ccc;
	padding: 0 10px;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: bold;
	color: #555;
`
