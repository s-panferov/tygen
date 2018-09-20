import * as React from 'react'

import { SignatureReflection } from '@tygen/reflector/src/reflection/signature/reflection'
import { TypePre } from './type'
import { PrettyCode } from './prettier'
import { TypeArgumentsPre } from '../type-parameters'
import { Join } from '../ui/join'
import { ReflectionPre } from '.'

export class SignaturePre extends PrettyCode<{ reflection: SignatureReflection }> {
	render() {
		const { reflection } = this.props
		const name =
			reflection.name === '__call' || reflection.name === '__type' ? '' : reflection.name
		return (
			<React.Fragment>
				{name}
				{reflection.typeParameters && (
					<TypeArgumentsPre types={reflection.typeParameters} />
				)}
				(
				<Join joinWith=",">
					{reflection.parameters.map(param => {
						return <ReflectionPre reflection={param} />
					})}
				</Join>
				): <TypePre reflection={reflection.returnType} />
			</React.Fragment>
		)
	}
}
