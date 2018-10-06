/**
 * The best interface in the world
 */
declare interface Test<T extends { a: 1 }> extends Array<T> {
	/**
	 * Literal parameter
	 */
	name: 1

	generic: T

	/**
	 * Best function in the world
	 * @param splitter Split me!
	 * @param limit How may times to split me
	 */
	split(splitter: 1, limit?: number): string[]
}

declare module 'test-mod' {
	export const a = 1
}

declare namespace React {
	export const a = 1
}
