import { generateInline, expect } from './utils'
import {
	isClassReflection
} from '../ast/class'
import {
	isConstructorDeclarationReflection,
} from '../ast/type/signature'

describe('class:constructor', () => {
	let module = generateInline(`
		class Test {
			constructor(a: Test)
			constructor(b: any) { }
		}
	`)

	let cls = module.items[0]

	it('compiles', () => {
		expect(cls).to.ok
	})

	it('class', () => {
		expect(cls.selfRef.id).to.ok
		expect(cls.name).to.equal('Test')
	})

	it('members', () => {
		if (isClassReflection(cls)) {
			expect(cls.constructSignatures).lengthOf(2)

			let constr = cls.constructSignatures[0]

			if (isConstructorDeclarationReflection(constr)) {
				expect(constr.name).equal('constructor')
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
