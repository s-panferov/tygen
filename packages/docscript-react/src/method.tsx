import * as React from 'react'
import { BaseView, withContext } from './view'
// import styled from 'styled-components'
// import { Item } from './ui/item'
import { MethodReflection } from '../../docscript-reflector/src/reflection/function/reflection'
import { SignatureView } from './signature'
import { ReflectionKind } from '@docscript/reflector/src/reflection'
import styled from 'styled-components'
import { NavItem } from './ui/nav'
import { RefLink, documentIdFromId } from './ref-link'

@withContext
export class MethodView extends BaseView<MethodReflection> {
	render() {
		const { reflection, settings } = this.props
		const { nav } = settings!

		if (nav) {
			return (
				<NavItem>
					<RefLink reflection={reflection} phantom />
				</NavItem>
			)
		}

		return (
			<MethodBody>
				{reflection.allCallSignatures &&
					reflection.allCallSignatures.map((sig, i) => {
						if (sig.kind === ReflectionKind.Signature) {
							return (
								<MethodSignature
									id={documentIdFromId(reflection.id!)}
									key={sig.id || i}>
									<SignatureView reflection={sig} />
								</MethodSignature>
							)
						} else {
							return <div>unsupported</div>
						}
					})}
			</MethodBody>
		)
	}
}

const MethodSignature = styled.div`
	& + & {
		margin-top: 20px;
	}
`

const MethodBody = styled.div`
	&:not(:only-child) {
		margin-bottom: 20px;
	}

	&:last-child {
		margin-bottom: 0px;
	}
`
