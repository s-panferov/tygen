import * as React from 'react'

import { PropertyReflection } from '@tygen/reflector/src/reflection/property/reflection'
import { TypePre } from './type'
import { PrettyCode } from './prettier'

export class PropertyPre extends PrettyCode<{ reflection: PropertyReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{reflection.name}: <TypePre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}
