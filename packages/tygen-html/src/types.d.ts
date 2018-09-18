declare module 'linaria' {
	export function css(...string: any[]): string
	export function cx(...string: (string | null | undefined | false)[]): string
}
