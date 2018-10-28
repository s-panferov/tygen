import { Manifest } from './html'

export interface ReactConverterSettings {
	contextRoot: string
	google?: {
		analytics?: {
			id: string
		}
	}
	packages?: {
		remote: string
	}
	manifest: Manifest
}

export function normalizeSettings(
	options: Partial<ReactConverterSettings>
): ReactConverterSettings {
	if (!options.contextRoot) {
		options.contextRoot = '/'
	}

	if (!options.manifest) {
		options.manifest = {
			'index.css': '/-/assets/index.css',
			'index.js': '/-/assets/index.js'
		}
	}

	return options as any
}
