import * as React from 'react'
import { BaseView, withContext } from './view'
// import { css,  styles } from 'linaria'
// import { Item } from './ui/item'
import { MethodReflection } from '../../tygen-reflector/src/reflection/function/reflection'
import { SignatureView } from './signature'
import { ReflectionKind } from '@tygen/reflector/src/reflection'
import { css, styles } from 'linaria'
import { NavItem } from './ui/nav'
import { RefLink, documentIdFromId } from './ref-link'

@withContext
export class MethodView extends BaseView<MethodReflection, { parentId?: string }> {
	render() {
		const { reflection, settings, parentId } = this.props
		const { nav } = settings!

		if (nav) {
			return (
				<NavItem>
					<RefLink reflection={reflection} phantom />
				</NavItem>
			)
		}

		return (
			<div {...styles(MethodBody)}>
				{reflection.allCallSignatures &&
					reflection.allCallSignatures.map((sig, i) => {
						if (sig.kind === ReflectionKind.Signature) {
							return (
								<div
									{...styles(MethodSignature)}
									id={documentIdFromId(reflection.id!)}
									key={sig.id || i}>
									<SignatureView reflection={sig} parentId={parentId} />
								</div>
							)
						} else {
							return <div>unsupported</div>
						}
					})}
			</div>
		)
	}
}

const MethodSignature = css`
	& + & {
		margin-top: var(--items-space);
	}
`

const MethodBody = css`
	&:not(:only-child) {
		margin-bottom: var(--items-space);
	}

	&:last-child {
		margin-bottom: 0px;
	}
`
