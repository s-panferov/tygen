import * as React from 'react'

import { PropertyReflection } from '@tygen/reflector'
import { ReflectionPre } from './index'
import { PrettyCode } from './prettier'
import { CommentView } from '../comment'

export class PropertyPre extends PrettyCode<{ reflection: PropertyReflection }> {
	render() {
		const { reflection } = this.props
		const br = `\n`
		return (
			<React.Fragment>
				{reflection.comments && this.doc(<CommentView inline reflection={reflection} />)}
				{reflection.name}
				{reflection.question ? '?' : ''}: <ReflectionPre reflection={reflection.type} />;
				{br}
			</React.Fragment>
		)
	}
}
