import * as React from 'react'

import { MethodReflection, ReflectionKind } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { CallSignaturesPre } from './call-signatures'

export class MethodPre extends PrettyCode<{ reflection: MethodReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<CallSignaturesPre key="call" join={`;\n`} callSignatures={reflection.callSignatures} />
		)
	}
}
