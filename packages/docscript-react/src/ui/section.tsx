import * as React from 'react'
import styled from 'styled-components'
import { Foldable } from './foldable'

export interface SectionProps {
	heading: React.ReactNode
}

export const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 250px);
	grid-column-gap: 20px;
	grid-row-gap: 5px;
`

export class Section extends React.Component<SectionProps> {
	static Grid = Grid

	render() {
		return (
			<SectionBody>
				<Foldable title={this.props.heading}>
					<SectionContent>{this.props.children}</SectionContent>
				</Foldable>
			</SectionBody>
		)
	}
}

const SectionContent = styled.div`
	display: flex;
	flex-direction: column;
`

const SectionBody = styled.div``
