import React from 'react'
import { css } from 'linaria'
import path from 'path'
import { renderToString } from 'react-dom/server'

import { Reflection, ReflectionKind } from '@tygen/reflector/src/reflection'
import { PageView } from './render'
import { ReactConverterSettings, normalizeSettings } from './settings'
import { hrefFromId } from './ref-link'
import { ViewSettings } from './view'

const Body = css`
	--default-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
		'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

	--monospace-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
	--items-space: 26px;

	font-family: var(--default-font);

	font-size: 14px;
	color: #222;

	h1 {
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

export function renderHTML(
	ref: Reflection,
	_fileName: string,
	settings: Partial<ReactConverterSettings> = {}
): string {
	const normalizedSettings = normalizeSettings(settings) as ViewSettings

	if (ref.id) {
		normalizedSettings.path = hrefFromId(ref.id || '').href
	} else if (ref.kind === ReflectionKind.Search) {
		normalizedSettings.path = '/_search'
	} else {
		normalizedSettings.path = '/'
	}

	const el = React.createElement(PageView, { reflection: ref, settings: normalizedSettings })
	const html = renderToString(el)

	return `
		<html>
			<head>
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"/>
				<link rel="stylesheet" type="text/css" href="${path.relative(
					normalizedSettings.path,
					'/-/assets/index.css'
				)}"/>
				<meta charset="UTF-8">
				<title>tsdoc - ${(ref as any).name || ref.id}</title>
				<script>
					const pathname = window.location.pathname
					const protocol = window.location.protocol
					if (protocol !== 'file:' && pathname[pathname.length - 1] !== '/') {
						const base = document.createElement('base')
						base.setAttribute('href', window.location.pathname + '/')
						document.head.appendChild(base)
					}
					window.__argv = ${JSON.stringify(normalizedSettings)}
					window.__ref = ${JSON.stringify(ref)}
				</script>
			</head>
			<body class="${Body}">
				<div id='react-app'>${html}</div>
				<script type="text/javascript" src="${path.relative(
					normalizedSettings.path,
					'/-/assets/index.js'
				)}" defer async></script>
			</body>
		</html>
	`
}
