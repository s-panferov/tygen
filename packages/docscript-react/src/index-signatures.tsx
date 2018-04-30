import React from 'react'
import { NavSection } from './ui/nav'
import { Section } from './ui/section'
import { withContext, ViewSettings } from './view'
import { ReflectionWithIndexSignatures } from '../../docscript-reflector/src/reflection/signature/reflection'
import { TypeView } from './type'
import styled from 'styled-components'

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
				<IndexSignaturesBody>
					[key: string]: <TypeView reflection={reflection.stringIndexType} />
				</IndexSignaturesBody>
			)

			const number = reflection.numberIndexType && (
				<IndexSignaturesBody>
					[key: string]: <TypeView reflection={reflection.numberIndexType} />
				</IndexSignaturesBody>
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

const IndexSignaturesBody = styled.span`
	font-family: monospace;
`
