type TypeName<T> = T extends string
	? 'string'
	: T extends number
		? 'number'
		: T extends boolean
			? 'boolean'
			: T extends undefined ? 'undefined' : T extends Function ? 'function' : 'object'

interface A {
	a: 1
	b: 2
	c: 3
}

type B<A extends object> = { [K in keyof A]: A[K] }
