import * as React from 'react'

import { MethodReflection } from '@tygen/reflector/src/reflection/function/reflection'
import { PrettyCode } from './prettier'
import { SignaturePre } from './signature'

export class MethodPre extends PrettyCode<{ reflection: MethodReflection }> {
	render() {
		const { reflection } = this.props
		return (
			reflection.ownCallSignatures &&
			reflection.ownCallSignatures.map(sig => {
				return <SignaturePre reflection={sig} />
			})
		)
	}
}
