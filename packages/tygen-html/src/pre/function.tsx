import * as React from 'react'

import { FunctionReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { SignaturePre } from './signature'

export class FunctionPre extends PrettyCode<{ reflection: FunctionReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{reflection.ownCallSignatures &&
					reflection.ownCallSignatures.map(sig => {
						return ['function ', <SignaturePre reflection={sig} />]
					})}
			</React.Fragment>
		)
	}
}
