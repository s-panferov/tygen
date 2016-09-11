import { generateInline, expect, typeRef } from './utils'
import {
	isInterfaceReflection
} from '../ast/interface'
import {
	isMethodReflection
} from '../ast/function'

describe('interface-interface-merge', () => {
	let module = generateInline(`
		interface Test<T, A, G> {
			prop: string
			foo(name: 'integer'): string
		}
		interface Test<T, A, G> {
			prop2: string
			foo(name: any): string
		}
	`)

	let iface = module.items[0]
	let iface2 = module.items[1]

	it('compiles', () => {
		expect(iface).to.ok
		expect(iface2).to.not.ok

		if (isInterfaceReflection(iface)) {
			expect(iface.properties).lengthOf(3)
			expect(iface.typeParameters).lengthOf(3)

			let method = iface.properties[0]
			if (isMethodReflection(method)) {
				expect(method.callSignatures).lengthOf(2)
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
