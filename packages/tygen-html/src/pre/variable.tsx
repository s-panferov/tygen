import * as React from 'react'

import { VariableReflection, ParameterReflection } from '@tygen/reflector'
import { ReflectionPre } from './index'
import { PrettyCode } from './prettier'
import { css } from 'linaria'
import { RefLink, getKey } from '../ref-link'

export class VariablePre extends PrettyCode<{ reflection: VariableReflection }> {
	render() {
		const reflection = this.props.reflection
		this.keyword('let', /let\s/, <LetKeyword />)
		return (
			<React.Fragment>
				let{' '}
				{this.id(
					reflection.name,
					<RefLink
						key={getKey(reflection)}
						className={NameStyle}
						reflection={reflection}
					/>
				)}
				: <ReflectionPre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}

export class ParameterPre extends PrettyCode<{ reflection: ParameterReflection }> {
	render() {
		const reflection = this.props.reflection
		return (
			<React.Fragment>
				{this.id(
					reflection.name,
					<RefLink
						key={getKey(reflection)}
						className={NameStyle}
						reflection={reflection}
					/>
				)}
				: <ReflectionPre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}

export function LetKeyword() {
	return <span style={{ color: '#444' }}>let </span>
}

const NameStyle = css`
	color: #2e86de;
	font-weight: bold;
`
