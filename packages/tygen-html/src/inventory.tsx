import * as React from 'react'

import { InventoryReflection, InventoryPackage } from '@tygen/reflector'
import { css, cx } from 'linaria'
import { Page } from './ui/layout'
import { Outline } from './ui/outline'
import { TreeRender, TreeRowProps } from './ui/tree-render'
import { Tree, TextItem, TreeNavigation } from './ui/tree'
import { autobind } from 'core-decorators'
import { observer } from 'mobx-react'
import { NormalizedLink } from './ref-link'

class PackageItem extends TextItem<InventoryPackage & { selected?: boolean }> {
	href() {
		return `${this.info.name}/${this.info.versions[0]}`
	}
}

function extractStructure(reflection: InventoryReflection) {
	return reflection.packages.map(pkg => {
		return new PackageItem(pkg.name, {
			text: `${pkg.name}->${pkg.versions[0]}`,
			...pkg
		})
	})
}

export class InventoryPage extends React.Component<{
	reflection: InventoryReflection
}> {
	tree = new Tree(extractStructure(this.props.reflection), tree => ({
		nav: new TreeNavigation(tree)
	}))

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline icon={null} header={<h1>Packages</h1>} />}>
				<TreeRender<PackageItem>
					tree={this.tree}
					rowHeight={30}
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
		return <InventoryNode {...props} />
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
}

@observer
export class InventoryNode extends React.Component<TreeRowProps<PackageItem>> {
	render() {
		const {
			item,
			item: { key, info }
		} = this.props
		return (
			<div key={key} className={cx(PackageRow, info.selected && 'selected')}>
				<div className={PackageNameCell}>
					<NormalizedLink className={PackageName} href={item.href()}>
						{info.name}
					</NormalizedLink>
				</div>
				<div className={PackageDescriptionCell}>{info.description}</div>
				<div className={PackageVersionCell}>{info.versions[0]}</div>
			</div>
		)
	}
}

const PackageNameCell = css`
	width: 150px;
	white-space: nowrap;

	@media (max-width: 500px) {
		width: auto;
		flex: 1 1 auto;
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

	&.selected {
		background-color: #eee;
	}

	& > div {
		padding: 10px 0px;
		padding-right: 10px;
	}

	&:nth-child(odd) {
		background-color: #f5f5f5;
	}
`

const PackageName = css`
	font-size: 14px;
	display: block;
`
