import * as React from 'react'

import { SignatureReflection } from '@tygen/reflector'
import { TypePre } from './type'
import { PrettyCode } from './prettier'
import { TypeArgumentsPre } from './type-parameters'
import { Join } from '../ui/join'
import { ReflectionPre } from '.'
import { CommentView } from '../comment'
import { getKey } from '../ref-link'

export class SignaturePre extends PrettyCode<{ reflection: SignatureReflection }> {
	render() {
		const { reflection } = this.props
		const name =
			reflection.name === '__call' || reflection.name === '__type' ? '' : reflection.name
		const br = `\n`
		return (
			<React.Fragment>
				{this.doc(<CommentView inline reflection={reflection} />)}
				{name}
				{reflection.typeParameters && (
					<TypeArgumentsPre types={reflection.typeParameters} />
				)}
				(
				<Join joinWith=",">
					{reflection.parameters.map((param, i) => {
						return <ReflectionPre key={getKey(param) || i} reflection={param} />
					})}
				</Join>
				): <TypePre reflection={reflection.returnType} />
				{br}
			</React.Fragment>
		)
	}
}
