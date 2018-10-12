import * as React from 'react'

import { FunctionReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { Join } from '../ui/join'
import { SignaturePre } from './signature'

export class FunctionPre extends PrettyCode<{ reflection: FunctionReflection }> {
	render() {
		const { reflection } = this.props
		console.log(reflection)
		return (
			<React.Fragment>
				<Join joinWith={`;\n`}>
					{reflection.allCallSignatures &&
						reflection.allCallSignatures.map(sig => {
							return (
								<React.Fragment>
									function <SignaturePre reflection={sig as any} />
								</React.Fragment>
							)
						})}
				</Join>
			</React.Fragment>
		)
	}
}
