import * as React from 'react'
import { Toolbar } from './ui/toolbar'
import { BaseView, withContext } from './view'

import { InventoryReflection } from '@docscript/reflector/src/reflection/inventory/reflection'
import styled from 'styled-components'
import { hrefFromId } from './ref-link'

@withContext
export class InventoryPage extends BaseView<InventoryReflection> {
	render() {
		const { settings, reflection } = this.props
		const { nav } = settings!
		if (nav) {
			return null
		}

		return (
			<div>
				<Toolbar pkg={'🏠'} />
				<InventoryBody>
					<table>
						<thead>
							<tr>
								<th>Package</th>
								<th>Description</th>
								<th>Version</th>
							</tr>
						</thead>
						<tbody>
							{reflection.packages.map(pkg => {
								return (
									<PackageRow key={pkg.name}>
										<td>
											<PackageRowName
												href={
													hrefFromId(`${pkg.name}->${pkg.versions[0]}`)
														.href
												}>
												{pkg.name}
											</PackageRowName>
										</td>
										<td>{pkg.description}</td>
										<td>{pkg.versions[0]}</td>
									</PackageRow>
								)
							})}
						</tbody>
					</table>
				</InventoryBody>
			</div>
		)
	}
}

const InventoryBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;

	td {
		padding: 10px;
	}

	th {
		text-align: center;
	}
`

const PackageRow = styled.tr`
	padding: 5px 10px;
	width: 400px;
	&:nth-child(even) {
		background-color: #f0f0f0;
	}
`
const PackageRowName = styled.a`
	font-weight: bold;
	font-size: 14px;
	display: block;
`
