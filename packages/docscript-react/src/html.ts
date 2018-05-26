import React from 'react'

import path from 'path'

import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { PageView } from './render'
import { ReactConverterSettings, normalizeSettings } from './settings'
import { hrefFromId } from './ref-link'
import { ViewSettings } from './view'

export function renderHTML(
	ref: Reflection,
	_fileName: string,
	settings: Partial<ReactConverterSettings> = {}
): string {
	const sheet = new ServerStyleSheet()
	const normalizedSettings = normalizeSettings(settings) as ViewSettings

	if (ref.id) {
		normalizedSettings.path = hrefFromId(ref.id || '').href
	} else if (ref.kind === ReflectionKind.Search) {
		normalizedSettings.path = '/_search'
	} else {
		normalizedSettings.path = '/'
	}

	const el = React.createElement(PageView, { reflection: ref, settings: normalizedSettings })
	const html = renderToString(sheet.collectStyles(el))

	return `
		<html>
			<head>
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"/>
				<meta charset="UTF-8">
				<title>tsdoc - ${(ref as any).name || ref.id}</title>
				<style>
					body {
						font-family: arial;
						font-size: 16px;
						color: #222;
					}

					h1 {
						padding-bottom: 5px;
					}

					h2 {
						padding-bottom: 5px;
					}

					a {
						text-decoration: none;
						color: #5352ed;
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
				</style>
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
				${sheet.getStyleTags()}
			</head>
			<body>
				<div id='react-app'>${html}</div>
				<script type="text/javascript" src="${path.relative(
					normalizedSettings.path,
					'/-/assets/index.js'
				)}" defer async></script>
			</body>
		</html>
	`
}
