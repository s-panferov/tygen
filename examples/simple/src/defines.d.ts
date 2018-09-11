declare interface Test {
	name: 1
	split(splitter: 1, limit?: number): string[]
}

declare module 'test-mod' {
	export const a = 1
}

declare namespace React {
	export const a = 1
}
