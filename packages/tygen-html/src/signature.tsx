import * as React from 'react'
import { css } from 'linaria'

import { SignatureReflection } from '../../tygen-reflector/src/reflection/signature/reflection'
import { TypeArgumentsPre } from './type-parameters'
import { TypePre } from './pre/type'
import { ReflectionView } from './render'
import { BaseView, withSettings } from './view'
import { CommentView } from './comment'
import { Badge } from './ui/badge'
import { DefinedIn } from './property'

@withSettings
export class SignatureView extends BaseView<SignatureReflection, { parentId?: string }> {
	render() {
		const { reflection, settings, parentId } = this.props
		const { compact } = settings!

		return (
			<div className={SignatureBody}>
				<span className={SignatureMain}>
					<span className={SignatureHead}>
						<span className={SignatureName}>
							{!compact && <Badge outline>fn</Badge>}
							<b>
								{reflection.name === '__call' || reflection.name === '__type'
									? ''
									: reflection.name}
							</b>
						</span>
						{reflection.typeParameters && (
							<TypeArgumentsPre types={reflection.typeParameters} />
						)}
						<span className={SignatureBrace}>(</span>
					</span>
					{reflection.parameters &&
						reflection.parameters.length > 0 && (
							<div className={SignatureParams}>
								{reflection.parameters.map((param, i) => {
									return (
										<div className={SignatureParam} key={param.id || i}>
											<ReflectionView reflection={param} />
										</div>
									)
								})}
							</div>
						)}
					<span className={SignatureBrace}>): </span>
					<TypePre reflection={reflection.returnType} />
				</span>
				<DefinedIn origin={reflection.origin} parentId={parentId} />
				<div className={SignatureComment}>
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
	font-family: var(--monospace-font);
	position: relative;
`

const SignatureBrace = css`
	color: #444;
`
