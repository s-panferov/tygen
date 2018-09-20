import { css } from 'linaria'

export const BodyStyle = css`
	--default-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
		'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

	--monospace-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
	--items-space: 26px;

	font-family: var(--default-font);

	font-size: 14px;
	color: #222;

	h1 {
		margin-top: 0px;
		margin-bottom: 0px;
		padding-bottom: 5px;
	}

	h2 {
		padding-bottom: 5px;
	}

	a {
		text-decoration: none;
		color: #5352ed;

		&:hover {
			text-decoration: underline;
		}
	}

	a.phantom {
		border-bottom: 1px dashed #ccc;
	}

	a:visited {
		color: #5352ed;
	}

	* {
		box-sizing: border-box;
	}
`
