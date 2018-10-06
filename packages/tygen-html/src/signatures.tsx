import React from 'react'
import { ReflectionView } from './render'
import { Reflection } from '@tygen/reflector'
import { PrettyCode } from './pre/prettier'

export class SignaturesPre extends PrettyCode<{
	signatures?: Reflection[]
	heading?: string
}> {
	render() {
		const { signatures } = this.props

		if (!signatures) {
			return null
		}

		let signaturesView = signatures.map((sig, i) => (
			<ReflectionView reflection={sig} key={sig.id || i} />
		))

		return signaturesView
	}
}
