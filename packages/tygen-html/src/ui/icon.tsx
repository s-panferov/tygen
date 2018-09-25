import React from 'react'
import { css } from 'linaria'

export class Icon extends React.Component<{ sym: SvgSymbol } & React.SVGAttributes<EventTarget>> {
	render() {
		const { sym, ...props } = this.props
		return (
			<svg className={IconStyle} width={14} height={14} {...props} viewBox={sym.viewBox}>
				<use href={'#' + sym.id} />
			</svg>
		)
	}
}

const IconStyle = css`
	& * {
		fill: #daa588;
	}
`
