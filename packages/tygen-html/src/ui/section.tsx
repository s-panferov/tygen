import * as React from 'react'
import { Foldable } from './foldable'

import { css, cx } from 'linaria'

export interface SectionProps {
	heading: React.ReactNode
}

export class Section extends React.Component<SectionProps> {
	static Grid = (props: React.HTMLAttributes<any>) => (
		<div className={cx(Grid, props.className)}>{props.children}</div>
	)

	render() {
		return (
			<div className={SectionBody}>
				<Foldable title={this.props.heading}>
					<div className={SectionContent}>{this.props.children}</div>
				</Foldable>
			</div>
		)
	}
}

const Grid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, 250px);
	grid-column-gap: var(--items-space);
	grid-row-gap: 5px;
`

const SectionContent = css`
	display: flex;
	flex-direction: column;
	margin-top: var(--items-space);
`

const SectionBody = css`
	/* margin-top: var(--items-space); */
`
