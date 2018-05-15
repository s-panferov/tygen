import { Reflection } from '@docscript/reflector/src/reflection'
import React from 'react'
import { ReflectionView } from './render'
import { NavSection } from './ui/nav'
import { Section } from './ui/section'
import { ViewSettings, withContext } from './view'

@withContext
export class PropertiesView extends React.Component<{
	properties?: Reflection[]
	settings?: ViewSettings
	parentId?: string
}> {
	render() {
		const { properties, settings, parentId } = this.props
		const { nav, compact } = settings!

		if (!properties) {
			return null
		}

		const propViews = properties.map(prop => {
			return <ReflectionView key={prop.id} reflection={prop} parentId={parentId} />
		})

		if (nav) {
			return (
				<NavSection key="props" heading="Properties">
					{propViews}
				</NavSection>
			)
		} else {
			if (compact) {
				return propViews
			} else {
				return (
					<Section key="props" heading={<h2>Properties</h2>}>
						{propViews}
					</Section>
				)
			}
		}
	}
}
