import * as React from 'react'

import { MethodReflection, ReflectionKind } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { SignaturePre } from './signature'
import { Join } from '../ui/join'
import { getKey } from '../ref-link'

export class MethodPre extends PrettyCode<{ reflection: MethodReflection }> {
	render() {
		const { reflection } = this.props
		if (reflection.allCallSignatures) {
			return (
				<React.Fragment>
					<Join joinWith={`;\n`}>
						{reflection.allCallSignatures.map((sig, i) => {
							if (sig.kind === ReflectionKind.Signature) {
								return <SignaturePre key={getKey(sig.id) || i} reflection={sig} />
							}
						})}
					</Join>
				</React.Fragment>
			)
		} else {
			return null
		}
	}
}
