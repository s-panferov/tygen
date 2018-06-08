import * as React from 'react'
import { EnumReflection } from '@tygen/reflector/src/reflection'
import { BaseView, withContext, ViewContext } from './view'
import { css, styles } from 'linaria'
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
					<span {...styles(EnumBody)}>
						enum <span {...styles(EnumName)}>{reflection.name}</span> {'{'}
						<div {...styles(EnumMembers)}>
							{reflection.members &&
								reflection.members.map(member => {
									return (
										<div
											{...styles(EnumMember)}
											id={documentIdFromId(member.id!)}
											key={member.id}>
											<span {...styles(EnumMemberName)}>
												<RefLink reflection={member} />
											</span>{' '}
											={' '}
											<span {...styles(EnumValue)}>
												{JSON.stringify(member.value)}
											</span>
											<CommentView reflection={reflection} />
										</div>
									)
								})}
						</div>
						{'}'}
					</span>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

const EnumName = css`
	color: #2e86de;
	font-weight: bold;
`

const EnumMember = css`
	& + & {
		margin-top: 10px;
	}
`
const EnumMembers = css`
	margin: 10px 0 10px 20px;
`
const EnumMemberName = css`
	color: #2e86de;
`

const EnumBody = css`
	font-family: var(--monospace-font);
`

const EnumValue = css`
	color: #10ac84;
`
