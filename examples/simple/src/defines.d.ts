declare interface Test {
	name: 1
	/**
	 * Split a string into substrings using the specified separator and return them as an array.
	 * @param splitter An object that can split a string.
	 * @param limit A value used to limit the number of elements returned in the array.
	 */
	split(splitter: 1, limit?: number): string[]
}
