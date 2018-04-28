import * as React from 'react'
import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import styled from 'styled-components'
import { BaseView } from './view'

function hrefFromId(id: string) {
	const parts = id.split('::')
	return {
		name: parts[parts.length - 1],
		href: '/' + id.replace(/::/g, '/')
	}
}

function createLink(reflection: Reflection): { name: string; href: string } {
	switch (reflection.kind) {
		case ReflectionKind.Link:
			return hrefFromId(reflection.target)
	}

	if (reflection.id) {
		return hrefFromId(reflection.id)
	}

	throw new Error(`Unsupported ${JSON.stringify(reflection, null, 4)}`)
}

export class RefLink extends BaseView<Reflection> {
	render() {
		let { name, href } = createLink(this.props.reflection)
		return <RefLinkBody href={href}>{name}</RefLinkBody>
	}
}

const RefLinkBody = styled.a`
	overflow: hidden;
	text-overflow: ellipsis;
`
