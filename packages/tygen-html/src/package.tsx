import * as React from 'react'
import { PackageReflection } from '@tygen/reflector/src/reflection'
import { Markdown } from './ui/markdown'
import { Page } from './ui/layout'
import { BaseView } from './view'
import { Icon } from './ui/icon'
import { Outline } from './ui/outline'

import PackageIcon from '@fortawesome/fontawesome-free/svgs/solid/cube.svg'
import BookIcon from '@fortawesome/fontawesome-free/svgs/brands/markdown.svg'

export class PackagePage extends BaseView<PackageReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={
					<Outline
						icon={<Icon width={20} height={20} sym={PackageIcon} />}
						header={<h1>{reflection.manifest.name}</h1>}
					/>
				}>
				<Outline header={<h2>README</h2>} icon={<Icon sym={BookIcon} />}>
					<Markdown source={reflection.readme || 'The package has no README'} />
				</Outline>
			</Page>
		)
	}
}
