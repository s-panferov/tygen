import { Route } from './service'

export interface Settings {
	contextRoot?: string
	assetsRoot?: string
	docRoot?: string

	defaultRoute?: Route
}

export interface DisplaySettings {
	inherited?: boolean
	public?: boolean
	exported?: boolean
}

export function defaultSettings(contextRoot?: string): Settings {
	contextRoot = contextRoot || window.location.pathname
	contextRoot = contextRoot == '/' ? '' : contextRoot
	let docRoot = `${contextRoot}/generated`
	let assetsRoot = `${contextRoot}/assets`

	return {
		contextRoot,
		assetsRoot,
		docRoot
	}
}
