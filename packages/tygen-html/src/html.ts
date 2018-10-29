import React from 'react'
import path from 'path'
import { renderToString } from 'react-dom/server'

import { Reflection, ReflectionKind } from '@tygen/reflector'
import { PageView } from './render'
import { ReactConverterSettings, normalizeSettings } from './settings'
import { formatLink } from './ref-link'
import { ViewSettings } from './view'
import { BodyStyle } from './theme/body'

export interface Manifest {
	[moduleName: string]: string
}

function formatGoolgeClickTracking(trackingId: string) {
	return `
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', '${trackingId}');
	</script>
	`
}

function includeGoogleTracking(settings: ReactConverterSettings) {
	if (settings.google && settings.google.analytics && settings.google.analytics.id) {
		return formatGoolgeClickTracking(settings.google.analytics.id)
	} else {
		return ''
	}
}

export function renderHTML(
	ref: Reflection,
	settings: Partial<ReactConverterSettings> = {}
): string {
	const set = normalizeSettings(settings) as ViewSettings

	if (ref.id) {
		set.path = formatLink(ref.id).href
	} else if (ref.kind === ReflectionKind.Search) {
		set.path = '_search'
	} else {
		set.path = ''
	}

	const el = React.createElement(PageView, { reflection: ref, settings: set })
	const html = renderToString(el)

	const name = (ref as any).name || (ref.id && ref.id[ref.id.length - 1].name)
	const base = path.relative(set.path, './')

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
				<script crossorigin src="https://unpkg.com/prettier@1.14.3/standalone.js" defer></script>
				<script crossorigin src="https://unpkg.com/prettier@1.14.3/parser-typescript.js" defer></script>
				<link rel="stylesheet" type="text/css" href="${set.manifest['index.css']}"/>
				<script>
					window.__argv = ${JSON.stringify(set)}
					window.__ref = "${encodeURIComponent(JSON.stringify(ref))}"
				</script>
				<script type="text/javascript" src="${set.manifest['index.js']}" defer></script>
			</head>
			<body class="${BodyStyle}">
				${includeGoogleTracking(set)}
				<div id='react-app'>${html}</div>
			</body>
		</html>
	`
}
