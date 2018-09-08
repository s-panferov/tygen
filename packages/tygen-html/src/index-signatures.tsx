import React from 'react'
import { NavSection } from './ui/nav'
import { Section } from './ui/section'
import { withContext, ViewSettings } from './view'
import { ReflectionWithIndexSignatures } from '@tygen/reflector/src/reflection/signature/reflection'
import { TypeView } from './type'
import { css } from 'linaria'

@withContext
export class IndexSignaturesView extends React.Component<{
	reflection: ReflectionWithIndexSignatures
	settings?: ViewSettings
}> {
	render() {
		const { reflection, settings } = this.props
		const { nav, compact } = settings!
		if (!reflection.numberIndexType && !reflection.stringIndexType) {
			return null
		}

		if (nav) {
			return <NavSection key="index" heading="Index Signatures" />
		} else {
			const string = reflection.stringIndexType && (
				<span className={IndexSignaturesBody} key={'string'}>
					[key: string]: <TypeView reflection={reflection.stringIndexType} />
				</span>
			)

			const number = reflection.numberIndexType && (
				<span className={IndexSignaturesBody} key={'number'}>
					[key: number]: <TypeView reflection={reflection.numberIndexType} />
				</span>
			)

			if (compact) {
				return [string, number]
			} else {
				return (
					<Section key="index" heading={<h2>Index Signatures</h2>}>
						{string}
						{number}
					</Section>
				)
			}
		}
	}
}

const IndexSignaturesBody = css`
	font-family: var(--monospace-font);
`
