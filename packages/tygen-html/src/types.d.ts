declare module 'linaria' {
	export interface LinariaCSS {
		__cssBrand: 'linaria'
	}
	export function css(...string: any[]): LinariaCSS
	export function styles(...args: (LinariaCSS | string | undefined)[]): React.HTMLAttributes<any>
}
