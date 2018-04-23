import * as React from 'react'
import { PackageReflection, Reflection } from '@docscript/reflector'
import styled from 'styled-components'

export interface SectionProps {
	heading: string
}

export class Section extends React.Component<SectionProps> {
	render() {
		return (
			<SectionBody>
				<Header>{this.props.heading}</Header>
				{this.props.children}
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
