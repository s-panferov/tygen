import * as React from 'react'
import { Foldable } from './foldable'

import { css, styles } from 'linaria'

export interface SectionProps {
	heading: React.ReactNode
}

export class Section extends React.Component<SectionProps> {
	static Grid = (props: React.HTMLAttributes<any>) => (
		<div {...styles(Grid, props.className)}>{props.children}</div>
	)

	render() {
		return (
			<div {...styles(SectionBody)}>
				<Foldable title={this.props.heading}>
					<div {...styles(SectionContent)}>{this.props.children}</div>
				</Foldable>
			</div>
		)
	}
}

const Grid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, 250px);
	grid-column-gap: 20px;
	grid-row-gap: 5px;
`

const SectionContent = css`
	display: flex;
	flex-direction: column;
`

const SectionBody = css``
