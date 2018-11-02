export abstract class B<V extends A<any>> {
	abstract a: 10
	/**
	 * Getter
	 */
	abstract get test(): 1

	/**
	 * Setter
	 */
	abstract set test(val: 1)

	abstract b(test?: 1 | null): 1
}

export interface Test1 {}

export interface Test<T> extends Test1 {
	name: T
}

export abstract class A<T> extends B<A<1>> implements Test<T> {
	name!: T
	static adf() {}
}
