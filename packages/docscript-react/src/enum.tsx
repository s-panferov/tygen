import * as React from 'react'
import { EnumReflection } from '@docscript/reflector/src/reflection'
import { BaseView, withContext, ViewContext } from './view'
import styled from 'styled-components'
import { parseId } from './helpers'
import { Toolbar } from './ui/toolbar'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Breadcrumb } from './breadcrumb'
import { CommentView } from './comment'
import { RefLink, documentIdFromId } from './ref-link'

@withContext
export class EnumPage extends BaseView<EnumReflection> {
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
						{reflection.name} <Badge>Enum</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<EnumBody>
						enum <EnumName>{reflection.name}</EnumName> {'{'}
						<EnumMembers>
							{reflection.members &&
								reflection.members.map(member => {
									return (
										<EnumMember
											id={documentIdFromId(member.id!)}
											key={member.id}>
											<EnumMemberName>
												<RefLink reflection={member} />
											</EnumMemberName>{' '}
											= <EnumValue>{JSON.stringify(member.value)}</EnumValue>
											<CommentView reflection={reflection} />
										</EnumMember>
									)
								})}
						</EnumMembers>
						{'}'}
					</EnumBody>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

const EnumName = styled.span`
	color: #2e86de;
	font-weight: bold;
`

const EnumMember = styled.div`
	& + & {
		margin-top: 10px;
	}
`
const EnumMembers = styled.div`
	margin: 10px 0 10px 20px;
`
const EnumMemberName = styled.span`
	color: #2e86de;
`

const EnumBody = styled.span`
	font-family: monospace;
`

const EnumValue = styled.span`
	color: #10ac84;
`
