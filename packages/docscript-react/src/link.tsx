import * as React from 'react'
import { PackageReflection, Reflection, ReflectionKind } from '@docscript/reflector'
import styled from 'styled-components'
import { ReflectionView } from './view'

export interface LinkProps {
	reflection: string
}

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

	throw new Error('Unsupported')
}

export class Link extends ReflectionView<Reflection> {
	render() {
		let { name, href } = createLink(this.props.reflection)
		return <LinkBody href={href}>{name}</LinkBody>
	}
}

const LinkBody = styled.a``
