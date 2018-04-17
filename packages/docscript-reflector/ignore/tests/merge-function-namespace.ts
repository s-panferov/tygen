import { generateInline, expect } from './utils'
import { isFunctionReflection } from '../ast/function'

describe('function-namespace-merge', () => {
	let module = generateInline(`
		function func(a: 'asdf', b: 'sadfasdfsd'): 'asdfsdf'
		function func(z: 'asdf', b: 'asdf'): 'asdfs'
		function func(d: Date, e: Date): Date
		function func(a: string, b: string): number
		function func(a: any, b: any): any {
			return a + b
		}
		namespace func {
			export let {a, b} = {a: 1, b: 1}
		}
	`)

	let func = module.items[0]
	let func2 = module.items[1]

	it('compiles', () => {
		expect(func).to.ok
		expect(func2).to.not.ok

		if (isFunctionReflection(func)) {
			expect(func.properties).lengthOf(2)
			expect(func.callSignatures).lengthOf(4)
		} else {
			expect.fail()
		}
	})
})
