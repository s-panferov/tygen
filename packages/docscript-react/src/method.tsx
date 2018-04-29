import * as React from 'react'
import { BaseView } from './view'
// import styled from 'styled-components'
// import { Item } from './ui/item'
import { MethodReflection } from '../../docscript-reflector/src/reflection/function/reflection'
import { SignatureView } from './signature'
import { ReflectionKind } from '@docscript/reflector/src/reflection'
import styled from 'styled-components'
import { NavItem } from './ui/nav'
import { RefLink, documentIdFromId } from './ref-link'

export class MethodView extends BaseView<MethodReflection> {
	render() {
		const { reflection, nav } = this.props

		if (nav) {
			return (
				<NavItem>
					<RefLink reflection={reflection} phantom />
				</NavItem>
			)
		}

		return (
			<div>
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
			</div>
		)
	}
}

const MethodSignature = styled.div`
	& + & {
		margin-top: 10px;
	}
`
