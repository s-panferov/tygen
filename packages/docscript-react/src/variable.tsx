import * as React from 'react'
import { VariableReflection } from '@docscript/reflector/src/reflection'
import { BaseView, withContext, ViewContext } from './view'
import { TypeView } from './type'
import styled from 'styled-components'
import { parseId } from './helpers'
import { Toolbar } from './ui/toolbar'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Breadcrumb } from './breadcrumb'
import { CommentView } from './comment'

export class VariableView extends BaseView<VariableReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span>
				<ParameterName>{reflection.name}</ParameterName>:{' '}
				{<TypeView reflection={reflection.type} />}
			</span>
		)
	}
}

const ParameterName = styled.span`
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
					<VariableBody>
						var <VariableName>{reflection.name}</VariableName>
						: <TypeView reflection={reflection.type} />
					</VariableBody>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

const VariableName = styled.span`
	color: #2e86de;
	font-weight: bold;
`

const VariableBody = styled.span`
	font-family: monospace;
`
