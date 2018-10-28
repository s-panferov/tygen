import { Reflection, ReflectionKind } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { Join } from '../ui/join'
import React, { Fragment } from 'react'
import { SignaturePre } from './signature'
import { getKey } from '../ref-link'

export class CallSignaturesPre extends PrettyCode<{
	keyword?: string
	join?: string
	callSignatures?: Reflection[]
}> {
	render() {
		const { callSignatures, keyword, join } = this.props
		if (!callSignatures) {
			return null
		}

		return (
			<Fragment>
				{callSignatures.map((sig, i) => {
					if (sig.kind === ReflectionKind.Signature) {
						return (
							<Fragment key={getKey(sig.id) || i}>
								<SignaturePre
									key={getKey(sig.id) || i}
									reflection={sig}
									keyword={keyword}
								/>
								{join || `;\n\n`}
							</Fragment>
						)
					}
				})}
			</Fragment>
		)
	}
}
