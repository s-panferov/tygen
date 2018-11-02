import * as React from 'react'

import { FunctionReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { SignaturePre } from './signature'
import { CallSignaturesPre } from './call-signatures'

export class FunctionPre extends PrettyCode<{ reflection: FunctionReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<CallSignaturesPre
				key="call"
				keyword="function"
				join={`;\n\n`}
				callSignatures={reflection.callSignatures}
			/>
		)
	}
}
