import * as React from 'react'

import { PrettyCode } from './prettier'
import { InterfaceReflection } from '@tygen/reflector'
import { CommentView } from '../comment'
import { IndexSignaturesPre } from './index-signatures'
import { SignaturesPre } from '../signatures'
import { ReflectionPre } from '.'
import { TypeArgumentsPre } from './type/type-arguments'
import { RefLink } from '../ref-link'

export class InterfacePre extends PrettyCode<{ reflection: InterfaceReflection }> {
	render() {
		const { reflection } = this.props
		this.keyword('interface', /interface\s/, <span className="keyword">interface </span>)
		return (
			<React.Fragment>
				{this.doc(<CommentView inline reflection={reflection} />)}
				interface{' '}
				{this.id(
					reflection.name,
					<RefLink reflection={reflection} className={'entity name type'} />
				)}{' '}
				{reflection.typeParameters && (
					<TypeArgumentsPre types={reflection.typeParameters} />
				)}
				{'{'}
				<IndexSignaturesPre key="index" reflection={reflection} />
				<SignaturesPre
					key="construct"
					signatures={reflection.constructSignatures}
					heading="Construct signatures"
				/>
				{reflection.allProperties &&
					reflection.allProperties.map((prop, i) => {
						return <ReflectionPre key={prop.id || i} reflection={prop} />
					})}
				{'}'}
			</React.Fragment>
		)
	}
}
