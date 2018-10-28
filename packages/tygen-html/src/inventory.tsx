import * as React from 'react'

import { InventoryReflection, InventoryPackage } from '@tygen/reflector'
import { css, cx } from 'linaria'
import { Page } from './ui/layout'
import { Outline } from './ui/outline'
import { TreeRender, TreeRowProps, NavTree } from './ui/tree-render'
import { TextItem } from './ui/tree'
import { autobind } from 'core-decorators'
import { observer } from 'mobx-react'
import { NormalizedLink } from './ref-link'
import { ViewSettings } from './view'
import { computed, observable } from 'mobx'
import { mobxPromise } from './utils/promise'
import axios from 'axios'
import { normalizePath } from './helpers'

class PackageItem extends TextItem<InventoryPackage & { selected?: boolean }> {
	href(version?: string) {
		return `${this.info.name}/${version || this.info.versions[0]}`
	}
}

function extractStructure(packages: InventoryPackage[]) {
	return packages.map(pkg => {
		return new PackageItem(pkg.name, {
			text: `${pkg.name}->${pkg.versions[0]}`,
			...pkg
		})
	})
}

@observer
export class InventoryPage extends React.Component<{
	reflection: InventoryReflection
	settings: ViewSettings
}> {
	@observable
	query: string | undefined = undefined

	searchResult = mobxPromise()
		.autorun(async () => {
			const res = await axios.get(this.remote! + '?query=' + this.query)
			return res.data as InventoryPackage[]
		})
		.build()

	@computed
	get tree() {
		if (!this.remote || !this.query) {
			return new NavTree(extractStructure(this.props.reflection.packages))
		} else {
			if (this.searchResult.payload.isValue()) {
				return new NavTree(extractStructure(this.searchResult.payload.value))
			} else {
				return new NavTree([])
			}
		}
	}

	@computed
	get remote() {
		const { settings } = this.props
		return settings.packages && settings.packages.remote
	}

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline icon={null} header={<h1>Packages</h1>} />}>
				<TreeRender<PackageItem>
					tree={this.tree}
					rowHeight={46}
					searchPlaceholder="Search for packages"
					onSearch={this.remote ? this.onRemoteSearch : undefined}
					onSelect={this.onSelect}
					itemRender={this.renderItem}>
					<div className={PackageRow}>
						<div className={PackageNameCell}>Package</div>
						<div className={PackageDescriptionCell}>Description</div>
						<div className={PackageVersionCell}>Version</div>
					</div>
				</TreeRender>
			</Page>
		)
	}

	@autobind
	renderItem(props: TreeRowProps<PackageItem>) {
		return <InventoryNode {...props} settings={this.props.settings} />
	}

	@autobind
	onSelect(e: React.KeyboardEvent<HTMLElement>, item: PackageItem) {
		if (item instanceof PackageItem) {
			const link = e.currentTarget.parentElement!.querySelector<HTMLElement>(
				`#${item.key} a`
			)!
			if (link) {
				link.click()
			}
		}
	}

	@autobind
	onRemoteSearch(query?: string) {
		this.query = query
	}
}

@observer
export class InventoryNode extends React.Component<
	TreeRowProps<PackageItem> & { settings: ViewSettings }
> {
	render() {
		const {
			item,
			item: { key, info },
			style
		} = this.props
		return (
			<div key={key} style={style} className={cx(PackageRow, info.selected && 'selected')}>
				<div className={PackageNameCell}>
					<NormalizedLink className={PackageName} href={item.href()}>
						{info.name}
					</NormalizedLink>
				</div>
				<div className={PackageDescriptionCell}>{info.description}</div>
				<div className={PackageVersionCell}>
					<select style={{ border: 'none' }} onChange={this.onSelect}>
						{info.versions.map(v => {
							return <option key={v}>{v}</option>
						})}
					</select>
				</div>
			</div>
		)
	}

	@autobind
	onSelect(e: React.FormEvent<HTMLSelectElement>) {
		debugger
		window.location.href = normalizePath(
			this.props.settings,
			this.props.item.href(e.currentTarget.value)
		)
	}
}

const PackageNameCell = css`
	width: 170px;
	white-space: nowrap;

	@media (max-width: 500px) {
		width: auto;
		flex: 1 1 auto;
	}

	> * {
		overflow: hidden;
		text-overflow: ellipsis;
	}
`
const PackageVersionCell = css`
	width: 100px;
	text-align: center;
`
const PackageDescriptionCell = css`
	flex: 1 1 auto;

	@media (max-width: 500px) {
		display: none;
	}
`

const PackageRow = css`
	display: flex;
	padding: 5px 10px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;

	&.selected {
		background-color: #eee;
	}

	& > div {
		padding: 10px 0px;
		padding-right: 10px;
	}

	border-bottom: 1px solid #eee;
`

const PackageName = css`
	font-size: 14px;
	display: block;
`
