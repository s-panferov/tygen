import * as React from 'react'

import { PrettyCode } from './prettier'
import { InterfaceReflection, ClassReflection, ReflectionKind } from '@tygen/reflector'
import { CommentView } from '../comment'
import { ReflectionPre } from '.'
import { TypeArgumentsPre } from './type/type-arguments'
import { RefLink, getKey } from '../ref-link'
import { Join } from '../ui/join'
import { CallSignaturesPre } from './call-signatures'

export class InterfacePre extends PrettyCode<{
	reflection: InterfaceReflection | ClassReflection
}> {
	render() {
		const { reflection } = this.props
		this.keyword('interface', /interface\s/, <span className="keyword">interface </span>)
		this.keyword('class', /class\s/, <span className="keyword">class </span>)
		const keyword = reflection.kind === ReflectionKind.Interface ? 'interface' : 'class'
		return (
			<React.Fragment>
				{this.doc(<CommentView inline reflection={reflection} />)}
				{keyword}{' '}
				{this.id(
					reflection.name,
					<RefLink reflection={reflection} className={'entity name type'} />
				)}{' '}
				{reflection.typeParameters && (
					<TypeArgumentsPre types={reflection.typeParameters} />
				)}
				{reflection.baseTypes && (
					<React.Fragment key="base">
						extends{' '}
						{reflection.baseTypes.map((type, i) => {
							return <ReflectionPre key={getKey(type) || i} reflection={type} />
						})}
					</React.Fragment>
				)}
				{'{'}
				<CallSignaturesPre
					key="constructor"
					keyword="constructor"
					callSignatures={(reflection as ClassReflection).constructSignatures}
				/>
				<CallSignaturesPre
					key="call"
					callSignatures={(reflection as InterfaceReflection).allCallSignatures}
				/>
				<Join joinWith={`\n`}>
					{reflection.allProperties &&
						reflection.allProperties.map((prop, i) => {
							return <ReflectionPre key={getKey(prop.id) || i} reflection={prop} />
						})}
				</Join>
				{'}'}
			</React.Fragment>
		)
	}
}
