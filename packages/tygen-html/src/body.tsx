import { css } from 'linaria'

import '../asset/tsd.css'

export const BodyStyle = css`
	--default-font: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
		Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

	--monospace-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
	--items-space: 26px;

	font-family: var(--default-font);

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
`
