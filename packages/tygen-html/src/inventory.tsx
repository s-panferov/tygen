import * as React from 'react'

import { BaseView, withSettings } from './view'

import { InventoryReflection } from '@tygen/reflector/src/reflection/inventory/reflection'
import { css } from 'linaria'
import { hrefFromId } from './ref-link'
import { normalizePath } from './helpers'
import { Page } from './ui/layout'
import { Outline } from './ui/outline'

export class InventoryPage_ extends BaseView<InventoryReflection> {
	render() {
		const { settings, reflection } = this.props

		return (
			<Page
				short
				reflection={reflection}
				header={<Outline icon={null} header={<h1>Packages</h1>} />}>
				<div className={InventoryBody}>
					<table className={InventoryTable}>
						<thead>
							<tr>
								<th>Package</th>
								<th>Description</th>
								<th>Version</th>
							</tr>
						</thead>
						<tbody>
							{reflection.packages.map(pkg => {
								console.log(pkg)
								const href = normalizePath(
									settings!,
									hrefFromId(`${pkg.name}->${pkg.versions[0]}`).href
								)

								return (
									<tr className={PackageRow} key={pkg.name}>
										<td>
											<a className={PackageRowName} href={href}>
												{pkg.name}
											</a>
										</td>
										<td>{pkg.description}</td>
										<td>{pkg.versions[0]}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</Page>
		)
	}
}

export const InventoryPage = withSettings(InventoryPage_)

const InventoryBody = css`
	display: flex;
	flex-direction: column;
	align-items: center;

	td {
		padding: 10px 0px;
		padding-right: 10px;
	}

	td:first-child {
		width: 10px;
		white-space: nowrap;
	}

	td:last-child {
		width: 100px;
		text-align: center;
	}

	th:last-child {
		text-align: center;
	}

	th {
		text-align: left;
		padding: 0px 0;
		padding-bottom: 5px;
		border-bottom: 1px solid #ccc;
	}
`

const InventoryTable = css`
	width: 100%;
`

const PackageRow = css`
	padding: 5px 10px;
	width: 400px;
	&:nth-child(even) {
		background-color: #f5f5f5;
	}
`
const PackageRowName = css`
	font-size: 14px;
	display: block;
`
