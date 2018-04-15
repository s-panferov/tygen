import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { EnumDeclarationReflection } from '../../doc/ast/enum'

import Heading from '../../explorer/components/heading'
import SmartLink from '../../explorer/components/smart-link'
import Paper from '../../explorer/components/paper'
import EnumMember from '../enum-member'
import Section from '../section'
import Comment from '../comment'

require('./index.css')
const block = theme.block('ts-enum')

export interface EnumProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	item: EnumDeclarationReflection
}

export interface EnumState {}

export default class Enum<P extends EnumProps> extends React.Component<P, EnumState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	getHeader() {
		return 'Enum '
	}

	render() {
		let en = this.props.item
		return (
			<Paper className={this.getClassName()}>
				<Heading lvl={1}>
					{this.getHeader()}
					<SmartLink route={en.selfRef}>{en.name}</SmartLink>
				</Heading>
				{en.comment && <Comment comment={en.comment} />}
				{en.members && this.renderMembers()}
			</Paper>
		)
	}

	renderMembers() {
		return this.props.item.members.map(member => {
			return <EnumMember key={member.selfRef.id} member={member} />
		})
	}
}
