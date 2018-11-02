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
				{(reflection as ClassReflection).abstract ? 'abstract ' : ''}
				{keyword}{' '}
				{this.id(
					reflection.name,
					<RefLink reflection={reflection} className={'entity name type'} />
				)}{' '}
				{reflection.typeParameters && (
					<TypeArgumentsPre types={reflection.typeParameters} />
				)}
				{reflection.extends && (
					<React.Fragment key="base">
						{' '}
						extends{' '}
						{reflection.extends.map((type, i) => {
							return <ReflectionPre key={getKey(type) || i} reflection={type} />
						})}
					</React.Fragment>
				)}
				{(reflection as ClassReflection).implements && (
					<React.Fragment key="implements">
						{' '}
						implements{' '}
						{(reflection as ClassReflection).implements!.map((type, i) => {
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
					callSignatures={(reflection as InterfaceReflection).callSignatures}
				/>
				<Join joinWith={`\n`}>
					{reflection.properties &&
						reflection.properties.map((prop, i) => {
							return <ReflectionPre key={getKey(prop.id) || i} reflection={prop} />
						})}
				</Join>
				{'}'}
			</React.Fragment>
		)
	}
}
