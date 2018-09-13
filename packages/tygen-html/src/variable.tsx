import * as React from 'react'
import {
	VariableReflection,
	ParameterReflection,
	ReflectionKind
} from '@tygen/reflector/src/reflection'
import { BaseView, withContext, ViewContext } from './view'
import { TypeView } from './type'
import { css } from 'linaria'
import { parseId } from './helpers'
import { Toolbar } from './ui/toolbar'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Breadcrumb } from './breadcrumb'
import { CommentView } from './comment'
import { prettyRender, PrettyContext, ident } from './prettier'

export class VariableView extends BaseView<VariableReflection | ParameterReflection> {
	render() {
		const { reflection } = this.props

		return (
			<span>
				{reflection.kind === ReflectionKind.Parameter && reflection.rest ? '...' : ''}
				<span className={ParameterName}>{reflection.name}</span>
				{reflection.kind === ReflectionKind.Parameter && reflection.optional
					? '?'
					: ''}: {<TypeView reflection={reflection.type} />}
			</span>
		)
	}
}

const ParameterName = css`
	color: #40739e;
`

@withContext
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
					<span className={VariableBody}>
						{prettyRender(<VariableTest reflection={reflection} />)}
					</span>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

export class VariableTest extends BaseView<VariableReflection> {
	static contextTypes = PrettyContext
	render() {
		const reflection = this.props.reflection
		return (
			<React.Fragment>
				var {ident(this, reflection.name, <VariableAnchor reflection={reflection} />)}:{' '}
				<GenericType />
			</React.Fragment>
		)
	}
}

export class VariableAnchor extends React.Component<{ reflection: VariableReflection }> {
	render() {
		return <a href="http://google.com">{this.props.reflection.name}</a>
	}
}

export class GenericType extends React.Component {
	symbol = Symbol()

	render() {
		return `Array<String>`
	}
}

const VariableName = css`
	color: #2e86de;
	font-weight: bold;
`

const VariableBody = css`
	font-family: var(--monospace-font);
`
