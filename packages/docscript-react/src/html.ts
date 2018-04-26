import { Reflection } from '@docscript/reflector/src/reflection'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { renderReflection } from './render'

export function renderHTML(ref: Reflection, _fileName: string): string {
	let sheet = new ServerStyleSheet()
	let el = renderReflection(ref)
	let html = renderToString(sheet.collectStyles(el))

	return `
		<html>
			<head>
				<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"/>
				<style>
					body {
						font-family: arial;
						font-size: 16px;
						color: #222;
					}

					h1 {
						border-bottom: 1px solid #ccc;
						padding-bottom: 5px;
					}

					h2 {
						border-bottom: 1px solid #ccc;
						padding-bottom: 5px;
					}
				</style>
				${sheet.getStyleTags()}
			</head>
			<body>
				<div id='react-app'>${html}</div>
				<script type="text/javascript" src="/-/client.js" defer async></script>
			</body>
		</html>
	`
}
