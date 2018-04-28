import React from 'react'
import { TypeParameterReflection } from '@docscript/reflector'
import { Join } from './ui/join'

export interface FoldableProps {
	title: React.ReactNode
}

export class TypeParameters extends React.Component<{ typeParameters: TypeParameterReflection[] }> {
	render() {
		const { typeParameters } = this.props
		return (
			<span>
				{'<'}
				<Join joinWith={i => <span key={i}>, </span>}>
					{typeParameters.map(ty => <span key={ty.id}>{ty.name}</span>)}
				</Join>
				{'>'}
			</span>
		)
	}
}
