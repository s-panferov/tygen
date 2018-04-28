import * as React from 'react'
import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import styled from 'styled-components'
import { BaseView } from './view'
import { parseId } from './helpers'

export function hrefFromId(id: string, relativeId?: string) {
	const ident = parseId(id)
	let href = `/${ident.pkg}/${ident.version}`
	if (ident.module) {
		href += '/' + ident.module.join('/')
	}

	if (ident.items) {
		href += '/' + ident.items[0]
		if (ident.items.length > 1) {
			href += `#` + ident.items.slice(1).join('/')
		}
	}

	const parts = (relativeId ? id.replace(relativeId, '') : id).split('::')
	let last = parts[parts.length - 1]
	if (last[0] === '/') {
		last = last.slice(1)
	}
	return {
		name: last,
		href
	}
}

export function documentIdFromId(id: string): string | undefined {
	const ident = parseId(id)

	if (ident.items) {
		return ident.items.join('/')
	} else {
		return undefined
	}
}

function createLink(reflection: Reflection, relativeId?: string): { name: string; href: string } {
	switch (reflection.kind) {
		case ReflectionKind.Link:
			return hrefFromId(reflection.target, relativeId)
	}

	if (reflection.id) {
		return hrefFromId(reflection.id, relativeId)
	}

	throw new Error(`Unsupported ${JSON.stringify(reflection, null, 4)}`)
}

export class RefLink extends BaseView<Reflection, { relativeId?: string }> {
	render() {
		const { relativeId } = this.props
		const { name, href } = createLink(this.props.reflection, relativeId)
		return <RefLinkBody href={href}>{name}</RefLinkBody>
	}
}

const RefLinkBody = styled.a`
	overflow: hidden;
	text-overflow: ellipsis;
`
