declare interface Test {
	/**
	 * Split a string into substrings using the specified separator and return them as an array.
	 * @param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
	 * @param limit A value used to limit the number of elements returned in the array.
	 */
	split(separator: string | RegExp, limit?: number): string[]
}
