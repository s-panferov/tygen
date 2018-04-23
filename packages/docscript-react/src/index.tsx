import * as React from 'react'
import * as path from 'path'
import { renderToString } from 'react-dom/server'

import { ServerStyleSheet } from 'styled-components'

import {
	Converter,
	Reflection,
	ReflectionWalker,
	ReflectionKind,
	PackageReflection
} from '@docscript/reflector'

import { PackageView } from './package'
import { Application } from './app'

function renderReflection(ref: Reflection): React.ReactElement<any> | undefined {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackageView reflection={ref} />
	}
	return undefined
}

export function renderHTML(ref: Reflection, fileName: string): string {
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
				</style>
				${sheet.getStyleTags()}
			</head>
			<body>${html}</body>
		</html>
	`
}

export class ReactConverter implements Converter {
	visitReflection(ref: Reflection, fileName: string, visitor: ReflectionWalker) {
		let parsedPath = path.parse(fileName)
		return [{ content: renderHTML(ref, fileName), name: `${parsedPath.name}.html` }]
	}
}

export default new ReactConverter()
