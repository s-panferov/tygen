import * as React from 'react'

import { PropertyReflection } from '@tygen/reflector'
import { ReflectionPre } from './index'
import { PrettyCode } from './prettier'
import { CommentView } from '../comment'

export class PropertyPre extends PrettyCode<{ reflection: PropertyReflection }> {
	render() {
		const { reflection } = this.props
		const br = `\n`
		const getter = reflection.getter && !reflection.setter
		const setter = reflection.setter && !reflection.getter
		return (
			<React.Fragment>
				{reflection.comments && this.doc(<CommentView inline reflection={reflection} />)}
				{reflection.abstract && 'abstract '}
				{reflection.static && 'static '}
				{getter ? 'get ' : ''}
				{setter ? 'set ' : ''}
				{reflection.name}
				{getter || setter ? '()' : ''}
				{reflection.question ? '?' : ''}: <ReflectionPre reflection={reflection.type} />;
				{br}
			</React.Fragment>
		)
	}
}
