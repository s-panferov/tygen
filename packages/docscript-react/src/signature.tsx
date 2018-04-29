import * as React from 'react'
import styled from 'styled-components'

import { SignatureReflection } from '../../docscript-reflector/src/reflection/signature/reflection'
import { TypeArguments } from './type-parameters'
import { TypeView } from './type'
import { ReflectionView } from './render'
import { BaseView } from './view'
import { CommentView } from './comment'
import { Badge } from './ui/badge'

export class SignatureView extends BaseView<SignatureReflection> {
	render() {
		const { reflection } = this.props

		return (
			<SignatureBody>
				<SignatureMain>
					<SignatureHead>
						<SignatureName>
							<Badge outline>fn</Badge>
							<b>{reflection.name}</b>
						</SignatureName>
						{reflection.typeParameters && (
							<TypeArguments types={reflection.typeParameters} />
						)}
						<SignatureBrace>(</SignatureBrace>
					</SignatureHead>
					{reflection.parameters &&
						reflection.parameters.length > 0 && (
							<SignatureParams>
								{reflection.parameters.map((param, i) => {
									return (
										<SignatureParam key={param.id || i}>
											<ReflectionView reflection={param} />
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
			</SignatureBody>
		)
	}
}

const SignatureName = styled.span`
	color: #c44569;
`

const SignatureBody = styled.div`
	margin-bottom: 20px;
`

const SignatureComment = styled.div``

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
	position: relative;
`

const SignatureBrace = styled.span`
	color: #ccc;
`
