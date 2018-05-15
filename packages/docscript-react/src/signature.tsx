import * as React from 'react'
import styled from 'styled-components'

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
			<SignatureBody>
				<SignatureMain>
					<SignatureHead>
						<SignatureName>
							{!compact && <Badge outline>fn</Badge>}
							<b>
								{reflection.name === '__call' || reflection.name === '__type'
									? ''
									: reflection.name}
							</b>
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
				<DefinedIn origin={reflection.origin} parentId={parentId} />
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
	& + & {
		margin-top: 10px;
	}
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
	color: #444;
`
