import React from 'react'
import { Reflection } from '@docscript/reflector'
import { parseId } from './helpers'
import styled from 'styled-components'
import { Join } from './ui/join'

export class Breadcrumb extends React.Component<{ reflection: Reflection }> {
	render() {
		const { reflection } = this.props
		const { id } = reflection

		if (!id) {
			return
		}

		const ident = parseId(id)

		const link = createLink(ident.pkg, ident.version)
		const packageLink = (
			<BreadcrumbLink key={link} href={link}>
				{ident.pkg}
			</BreadcrumbLink>
		)

		const moduleLink = ident.module
			? ident.module.map((module, i) => {
					const slice = ident.module!.slice(0, i + 1)
					const link = createLink(ident.pkg, ident.version, ...slice)
					return (
						<BreadcrumbLink key={link} href={link}>
							{module}
						</BreadcrumbLink>
					)
			  })
			: undefined

		const identLink = ident.items
			? ident.items.map((item, i) => {
					const slice = ident.items!.slice(0, i + 1)
					const link = createLink(ident.pkg, ident.version, ...ident.module!, ...slice)
					return <BreadcrumbLink href={link}>{item}</BreadcrumbLink>
			  })
			: undefined

		return (
			<BreadcrumbBody>
				<Join joinWith={i => <BreadcrumbSep key={i}>/</BreadcrumbSep>}>
					{packageLink}
					{moduleLink}
					{identLink}
				</Join>
			</BreadcrumbBody>
		)
	}
}

export function createLink(...parts: string[]) {
	return '/' + parts.join('/')
}

const BreadcrumbBody = styled.span`
	font-size: 14px;
`
const BreadcrumbLink = styled.a``
const BreadcrumbSep = styled.span`
	padding: 0 2px;
	color: #ccc;
`
