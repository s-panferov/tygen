import * as React from 'react'

import { PropertyReflection } from '@tygen/reflector'
import { TypePre } from './type'
import { PrettyCode } from './prettier'
import { CommentView } from '../comment'

export class PropertyPre extends PrettyCode<{ reflection: PropertyReflection }> {
	render() {
		const { reflection } = this.props
		const br = `\n`
		return (
			<React.Fragment>
				{this.doc(<CommentView inline reflection={reflection} />)}
				{reflection.name}: <TypePre reflection={reflection.type} />;{br}
			</React.Fragment>
		)
	}
}
