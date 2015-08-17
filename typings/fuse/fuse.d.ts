// Type definitions for Fuse.js 1.1.5
// Project: https://github.com/krisk/Fuse
// Definitions by: Greg Smith <https://github.com/smrq/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module "fuse" {
	export default class Fuse {
		constructor(list: any[], options?: FuseOptions);
		search(pattern: string): any[];
	}

	interface FuseOptions extends SearchOptions {
		caseSensitive?: boolean;
		includeScore?: boolean;
		shouldSort?: boolean;
		searchFn?: any;
		sortFn?: (a: {score: number}, b: {score: number}) => number;
		getFn?: (obj: any, path: string) => any;
		keys?: string[];
	}

	interface SearchOptions {
		location?: number;
		distance?: number;
		threshold?: number;
		maxPatternLength?: number;
	}
}
