import * as React from 'react'

import { PrettyCode } from './prettier'
import { InterfaceReflection, ClassReflection } from '@tygen/reflector'
import { CommentView } from '../comment'
import { ReflectionPre } from '.'
import { TypeArgumentsPre } from './type/type-arguments'
import { RefLink, getKey } from '../ref-link'
import { Join } from '../ui/join'

export class InterfacePre extends PrettyCode<{
	reflection: InterfaceReflection | ClassReflection
}> {
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
