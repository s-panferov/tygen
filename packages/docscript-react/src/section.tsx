import * as React from 'react'
import styled from 'styled-components'
import { Foldable } from './foldable'

export interface SectionProps {
	heading: string
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
			<Foldable title={<Header id={this.props.heading}>{this.props.heading}</Header>}>
				<SectionBody>{this.props.children}</SectionBody>
			</Foldable>
		)
	}
}

const Header = styled.h2`
	font-size: 14px;
	text-transform: uppercase;
	color: #444;

	margin: 0;
	margin-bottom: 10px;
	padding: 0;
`

const SectionBody = styled.div`
	display: flex;
	flex-direction: column;
`
