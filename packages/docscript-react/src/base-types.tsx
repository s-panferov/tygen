import * as React from 'react'
import { Reflection } from '@docscript/reflector/src/reflection'
import { RefLink } from './ref-link'
import { css, styles } from 'linaria'

export class BaseTypes extends React.Component<{ types?: Reflection[]; title?: string }> {
	render() {
		const { title, types } = this.props
		if (!types) {
			return null
		}

		return (
			<div>
				<div {...styles(ExtendsKeyword)}>{title || 'Extends'}:</div>
				<ul {...styles(List)}>
					{types.map((type, i) => {
						return (
							<li key={type.id || i}>
								<RefLink reflection={type} />
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

const List = css`
	margin: 0;
	margin-top: 10px;
`

const ExtendsKeyword = css`
	color: #888;
	font-size: 14px;
`
