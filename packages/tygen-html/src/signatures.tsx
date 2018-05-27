import React from 'react'
import { ReflectionView } from './render'
import { NavSection } from './ui/nav'
import { Section } from './ui/section'
import { Reflection } from '@tygen/reflector/src/reflection'
import { withContext, ViewSettings } from './view'

@withContext
export class SignaturesView extends React.Component<{
	signatures?: Reflection[]
	heading?: string
	settings?: ViewSettings
}> {
	render() {
		const { signatures, heading, settings } = this.props
		const { nav } = settings!

		if (!signatures) {
			return null
		}

		let signaturesView = signatures.map((sig, i) => (
			<ReflectionView reflection={sig} key={sig.id || i} />
		))

		if (nav) {
			return <NavSection heading={heading} />
		} else {
			if (!heading) {
				return signaturesView
			} else {
				return <Section heading={<h2>{heading}</h2>}>{signaturesView}</Section>
			}
		}
	}
}
