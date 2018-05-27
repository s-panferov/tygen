export interface ReactConverterSettings {
	contextRoot: string
}

export function normalizeSettings(
	options: Partial<ReactConverterSettings>
): ReactConverterSettings {
	if (!options.contextRoot) {
		options.contextRoot = '/'
	}

	return options as ReactConverterSettings
}
