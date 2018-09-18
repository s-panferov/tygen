import React from 'react'
import path from 'path'
import { renderToString } from 'react-dom/server'

import { Reflection, ReflectionKind } from '@tygen/reflector/src/reflection'
import { PageView } from './render'
import { ReactConverterSettings, normalizeSettings } from './settings'
import { hrefFromId } from './ref-link'
import { ViewSettings } from './view'
import { BodyStyle } from './body'

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
				<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js" defer></script>
				<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" defer></script>
				<script crossorigin src="https://unpkg.com/prettier@1.14.2/standalone.js" defer></script>
				<script crossorigin src="https://unpkg.com/prettier@1.14.2/parser-typescript.js" defer></script>
				<script type="text/javascript" src="${path.relative(
					normalizedSettings.path,
					'/-/assets/index.js'
				)}" defer></script>
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
			<body class="${BodyStyle}">
				<div id='react-app'>${html}</div>
			</body>
		</html>
	`
}
