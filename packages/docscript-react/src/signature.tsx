import * as React from 'react'
import { css, styles } from 'linaria'

import { SignatureReflection } from '../../docscript-reflector/src/reflection/signature/reflection'
import { TypeArguments } from './type-parameters'
import { TypeView } from './type'
import { ReflectionView } from './render'
import { BaseView, withContext } from './view'
import { CommentView } from './comment'
import { Badge } from './ui/badge'
import { DefinedIn } from './property'

@withContext
export class SignatureView extends BaseView<SignatureReflection, { parentId?: string }> {
	render() {
		const { reflection, settings, parentId } = this.props
		const { compact } = settings!

		return (
			<div {...styles(SignatureBody)}>
				<span {...styles(SignatureMain)}>
					<span {...styles(SignatureHead)}>
						<span {...styles(SignatureName)}>
							{!compact && <Badge outline>fn</Badge>}
							<b>
								{reflection.name === '__call' || reflection.name === '__type'
									? ''
									: reflection.name}
							</b>
						</span>
						{reflection.typeParameters && (
							<TypeArguments types={reflection.typeParameters} />
						)}
						<span {...styles(SignatureBrace)}>(</span>
					</span>
					{reflection.parameters &&
						reflection.parameters.length > 0 && (
							<div {...styles(SignatureParams)}>
								{reflection.parameters.map((param, i) => {
									return (
										<div {...styles(SignatureParam)} key={param.id || i}>
											<ReflectionView reflection={param} />
										</div>
									)
								})}
							</div>
						)}
					<span {...styles(SignatureBrace)}>): </span>
					<TypeView reflection={reflection.returnType} />
				</span>
				<DefinedIn origin={reflection.origin} parentId={parentId} />
				<div {...styles(SignatureComment)}>
					<CommentView reflection={reflection} />
				</div>
			</div>
		)
	}
}

const SignatureName = css`
	color: #c44569;
`

const SignatureBody = css`
	& + & {
		margin-top: 10px;
	}
`

const SignatureComment = css``

const SignatureParam = css`
	& + & {
		margin-top: 6px;
	}
`

const SignatureParams = css`
	padding: 6px 0px 6px 20px;
`

const SignatureHead = css`
	color: #c44569;
`

const SignatureMain = css`
	font-family: monospace;
	position: relative;
`

const SignatureBrace = css`
	color: #444;
`
