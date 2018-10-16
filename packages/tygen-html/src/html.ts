import React from 'react'
import path from 'path'
import { renderToString } from 'react-dom/server'

import { Reflection, ReflectionKind } from '@tygen/reflector'
import { PageView } from './render'
import { ReactConverterSettings, normalizeSettings } from './settings'
import { formatLink } from './ref-link'
import { ViewSettings } from './view'
import { BodyStyle } from './theme/body'

export function renderHTML(
	ref: Reflection,
	_fileName: string,
	settings: Partial<ReactConverterSettings> = {}
): string {
	const normalizedSettings = normalizeSettings(settings) as ViewSettings

	if (ref.id) {
		normalizedSettings.path = formatLink(ref.id).href
	} else if (ref.kind === ReflectionKind.Search) {
		normalizedSettings.path = '_search'
	} else {
		normalizedSettings.path = ''
	}

	const el = React.createElement(PageView, { reflection: ref, settings: normalizedSettings })
	const html = renderToString(el)

	const name = (ref as any).name || (ref.id && ref.id[ref.id.length - 1].name)
	const base = path.relative(normalizedSettings.path, './')

	return `
		<html>
			<head>
				<meta charset="UTF-8">
				<title>${name} - TypeScript</title>
				<script>
					__webpack_public_path__ = "${base}"
				</script>
				<base href="${base || '.'}" />
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"/>
				<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
				<link href="https://fonts.googleapis.com/css?family=Fira+Mono" rel="stylesheet">
				<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js" defer></script>
				<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" defer></script>
				<script crossorigin src="https://unpkg.com/prettier@1.14.2/standalone.js" defer></script>
				<script crossorigin src="https://unpkg.com/prettier@1.14.2/parser-typescript.js" defer></script>
				<link rel="stylesheet" type="text/css" href="-/assets/index.css"/>
				<script>
					window.__argv = ${JSON.stringify(normalizedSettings)}
					window.__ref = ${JSON.stringify(ref)}
				</script>
				<script type="text/javascript" src="-/assets/index.js" defer></script>
			</head>
			<body class="${BodyStyle}">
				<div id='react-app'>${html}</div>
			</body>
		</html>
	`
}
