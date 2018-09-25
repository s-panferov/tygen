declare module 'linaria' {
	export function css(...string: any[]): string
	export function cx(...string: (string | null | undefined | false)[]): string
}

interface SvgSymbol {
	viewBox: string
	id: string
}

declare module '*.svg' {
	const a: SvgSymbol
	export default a
}
