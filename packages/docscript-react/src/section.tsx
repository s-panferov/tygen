import * as React from 'react'
import styled from 'styled-components'

export interface SectionProps {
	heading: string
}

export class Section extends React.Component<SectionProps> {
	render() {
		return (
			<SectionBody>
				<Header>{this.props.heading}</Header>
				<Content>{this.props.children}</Content>
			</SectionBody>
		)
	}
}

const Header = styled.h2`
	font-size: 14px;
	text-transform: uppercase;
	color: #444;
`

const SectionBody = styled.div`
	padding: 10px;
	display: flex;
	flex-direction: column;
`

const Content = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 250px);
	grid-column-gap: 20px;
	grid-row-gap: 5px;
`
