import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { InterfaceReflection } from '../../doc/ast/interface'

import Heading from '../../explorer/components/heading'
import SmartLink from '../../explorer/components/smart-link'
import Paper from '../../explorer/components/paper'

import TypeParameters from '../type-parameters'
import TypeMembers from '../type-members'
import InterfaceHeritage from '../interface-heritage'
import Comment from '../comment'

require('./index.css')
const block = theme.block('ts-interface')

export interface InterfaceProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	item: InterfaceReflection
	showInherited: boolean
	showNonPublic: boolean
}

export interface InterfaceState {}

export default class Interface<P extends InterfaceProps> extends React.Component<
	P,
	InterfaceState
> {
	static contextTypes = theme.themeContext

	renderComment: boolean = true

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	getHeader() {
		return 'Interface'
	}

	render() {
		let iface = this.props.item
		let tpWithConstraint =
			iface.typeParameters &&
			iface.typeParameters.filter(tp => {
				return !!tp.constraint
			})
		return (
			<Paper
				id={iface.selfRef.id}
				block={true}
				highlight={false}
				className={this.getClassName()}>
				<Heading lvl={1}>
					<span>{this.getHeader()} </span>
					<SmartLink route={iface.selfRef}>{iface.name}</SmartLink>
					{iface.typeParameters && (
						<TypeParameters
							asConstraint={false}
							typeParameters={iface.typeParameters}
						/>
					)}
				</Heading>
				<div className={block('constraints')}>
					{tpWithConstraint &&
						!!tpWithConstraint.length && (
							<TypeParameters asConstraint={true} typeParameters={tpWithConstraint} />
						)}
				</div>
				<div className={block('heritage')}>
					{iface.heritageClauses && <InterfaceHeritage clauses={iface.heritageClauses} />}
				</div>
				{this.renderComment && iface.comment && <Comment comment={iface.comment} />}
				{iface.properties && (
					<TypeMembers
						properties={iface.properties}
						indexSignatures={iface.indexSignatures}
						showInherited={this.props.showInherited}
						showNonPublic={this.props.showNonPublic}
						callSignatures={iface.callSignatures}
						constructSignatures={iface.constructSignatures}
					/>
				)}
			</Paper>
		)
	}
}
