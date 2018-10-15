export interface ReflectOptions {
	project: string
	out: string
	includeLibs: boolean
	includeTypes: boolean
	alwaysLink: boolean
}

export interface GenerateOptions {
	out: string
	with: string
}
