declare module 'linaria' {
	export function css(...string: any[]): string
	export function names(...string: (string | null | undefined | false)[]): string
}
