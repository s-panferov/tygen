// type TypeName<T> = T extends string
// 	? 'string'
// 	: T extends number
// 		? 'number'
// 		: T extends boolean
// 			? 'boolean'
// 			: T extends undefined ? 'undefined' : T extends Function ? 'function' : 'object'

// interface A {
// 	a: 1
// 	b: 2
// 	c: 3
// }

export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any
