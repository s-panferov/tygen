import React from 'react'
import { Join } from './ui/join'
import { TypeReflection } from '@tygen/reflector/src/reflection/_type/reflection'
import { TypeView } from './type'

export interface FoldableProps {
	title: React.ReactNode
}

export class TypeArguments extends React.Component<{ types: TypeReflection[] }> {
	render() {
		const { types } = this.props
		return (
			<span>
				{'<'}
				<Join joinWith={i => <span key={i}>, </span>}>
					{types.map((ty, i) => <TypeView key={ty.id || `ty${i}`} reflection={ty} />)}
				</Join>
				{'>'}
			</span>
		)
	}
}
