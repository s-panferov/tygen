import { css } from 'linaria'

import '../../asset/tsd.css'
import { StyleVariables } from './variables'
import { bodyStyle } from './color'

export const BodyStyle = css`
	${StyleVariables.FontFamily}: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
		sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

	${StyleVariables.FontFamilyMono}: 'Fira Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace;

	font-family: var(${StyleVariables.FontFamily});

	font-size: 14px;
	color: #222;

	a {
		text-decoration: none;
		color: #04b;

		&:hover {
			text-decoration: none;
			color: #c70000;
		}
	}

	a.phantom {
		border-bottom: 1px dashed #ccc;
	}

	* {
		box-sizing: border-box;
	}

	${bodyStyle};
`
