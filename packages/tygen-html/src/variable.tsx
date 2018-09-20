import * as React from 'react'

import { BaseView, withSettings, ViewContext } from './view'
import { TypePre } from './pre/type'
import { css } from 'linaria'
import { parseId } from './helpers'
import { Toolbar } from './ui/toolbar'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Breadcrumb } from './breadcrumb'
import { CommentView } from './comment'
import { prettyRender, PrettyCode } from './pre/prettier'

import {
	VariableReflection,
	ParameterReflection,
	ReflectionKind
} from '@tygen/reflector/src/reflection'

export class VariableView extends BaseView<VariableReflection | ParameterReflection> {
	render() {
		const { reflection } = this.props

		return (
			<span>
				{reflection.kind === ReflectionKind.Parameter && reflection.rest ? '...' : ''}
				<span className={ParameterName}>{reflection.name}</span>
				{reflection.kind === ReflectionKind.Parameter && reflection.optional
					? '?'
					: ''}: {<TypePre reflection={reflection.type} />}
			</span>
		)
	}
}

const ParameterName = css`
	color: #40739e;
`

@withSettings
export class VariablePage extends BaseView<VariableReflection> {
	render() {
		const { reflection, settings } = this.props

		const ident = parseId(reflection.id!)
		const sections = [] as React.ReactNode[]

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout
					sidebar={
						<ViewContext.Provider value={Object.assign({}, settings, { nav: true })} />
					}>
					<h1>
						{reflection.name} <Badge>Var</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<span className={BodyStyle}>
						{prettyRender(<VariablePre reflection={reflection} />)}
					</span>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

export class VariablePre extends PrettyCode<{ reflection: VariableReflection }> {
	render() {
		const reflection = this.props.reflection
		this.registerKeyword('var', /var\s/g, <VarKeyword />)
		return (
			<React.Fragment>
				let{' '}
				{this.id(reflection.name, <VariableName key={'name'} reflection={reflection} />)}
			</React.Fragment>
		)
	}
}

export class VariableName extends React.Component<{ reflection: VariableReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<a className={NameStyle} href="#">
				{reflection.name}
			</a>
		)
	}
}

export function VarKeyword() {
	return <span style={{ color: '#444' }}>var </span>
}

const NameStyle = css`
	color: #2e86de;
	font-weight: bold;
`

const BodyStyle = css`
	font-family: var(--monospace-font);
	white-space: pre;
`
