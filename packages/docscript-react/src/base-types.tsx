import * as React from 'react'
import { Reflection } from '@docscript/reflector/src/reflection'
import { RefLink } from './ref-link'
import styled from 'styled-components'

export class BaseTypes extends React.Component<{ types?: Reflection[]; title?: string }> {
	render() {
		const { title, types } = this.props
		if (!types) {
			return null
		}

		return (
			<div>
				<ExtendsKeyword>{title || 'Extends'}:</ExtendsKeyword>
				<List>
					{types.map(type => {
						return (
							<li>
								<RefLink reflection={type} />
							</li>
						)
					})}
				</List>
			</div>
		)
	}
}

const List = styled.ul`
	margin: 0;
	margin-top: 10px;
`

const ExtendsKeyword = styled.div`
	color: #888;
	font-size: 14px;
`
