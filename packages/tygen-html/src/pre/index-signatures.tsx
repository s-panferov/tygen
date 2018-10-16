import React from 'react'
import { ReflectionWithIndexSignatures } from '@tygen/reflector'
import { ReflectionPre } from './index'
import { PrettyCode } from './prettier'

export class IndexSignaturesPre extends PrettyCode<{
	reflection: ReflectionWithIndexSignatures
}> {
	render() {
		const { reflection } = this.props
		if (!reflection.numberIndexType && !reflection.stringIndexType) {
			return null
		}

		const string = reflection.stringIndexType && (
			<React.Fragment key="string-index">
				[key: string]: <ReflectionPre reflection={reflection.stringIndexType} />;
			</React.Fragment>
		)

		const number = reflection.numberIndexType && (
			<React.Fragment key="number-index">
				[key: number]: <ReflectionPre reflection={reflection.numberIndexType} />;
			</React.Fragment>
		)

		return [string, number]
	}
}
