import * as React from 'react'

import { FunctionReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { SignaturePre } from './signature'

export class FunctionPre extends PrettyCode<{ reflection: FunctionReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{reflection.allCallSignatures &&
					reflection.allCallSignatures.map((sig, i) => {
						return (
							<React.Fragment key={i}>
								function <SignaturePre reflection={sig as any} />;{`\n\n`}
							</React.Fragment>
						)
					})}
			</React.Fragment>
		)
	}
}
