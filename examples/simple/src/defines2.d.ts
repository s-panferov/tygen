declare interface Test<T> {
	split(separator: string | RegExp, limit?: number): string[]
}

declare module 'test-mod' {
	export const b = 1
}
