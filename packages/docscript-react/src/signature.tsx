import * as React from 'react'
import styled from 'styled-components'

import { SignatureReflection } from '../../docscript-reflector/src/reflection/signature/reflection'
import { TypeParameters } from './type-parameters'
import { TypeView } from './type'
import { ReflectionView } from './render'
import { BaseView } from './view'
import { CommentView } from './comment'

export class SignatureView extends BaseView<SignatureReflection, { name: string }> {
	render() {
		const { reflection, name } = this.props

		return (
			<div>
				<SignatureMain>
					<SignatureHead>
						<SignatureName>{name}</SignatureName>
						{reflection.typeParameters && (
							<TypeParameters typeParameters={reflection.typeParameters} />
						)}
						<SignatureBrace>(</SignatureBrace>
					</SignatureHead>
					{reflection.parameters &&
						reflection.parameters.length > 0 && (
							<SignatureParams>
								{reflection.parameters.map((param, i) => {
									return (
										<SignatureParam>
											<ReflectionView
												key={param.id || i}
												reflection={param}
											/>
										</SignatureParam>
									)
								})}
							</SignatureParams>
						)}
					<SignatureBrace>): </SignatureBrace>
					<TypeView reflection={reflection.returnType} />
				</SignatureMain>
				<SignatureComment>
					<CommentView reflection={reflection} />
				</SignatureComment>
			</div>
		)
	}
}

const SignatureName = styled.span`
	color: #c44569;
`

const SignatureComment = styled.div`
	margin-left: 20px;
`

const SignatureParam = styled.div`
	& + & {
		margin-top: 6px;
	}
`

const SignatureParams = styled.div`
	padding: 6px 0px 6px 20px;
`

const SignatureHead = styled.span`
	color: #c44569;
`

const SignatureMain = styled.span`
	font-family: monospace;
`

const SignatureBrace = styled.span`
	color: #666;
`
