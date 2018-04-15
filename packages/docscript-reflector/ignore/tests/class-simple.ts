import { generateInline, expect, typeRef } from './utils'
import { isClassReflection } from '../ast/class'
import { isPropertyDeclarationReflection } from '../ast/type/property'

describe('class:simple', () => {
	let module = generateInline(`
		class Test {
			prop: Test
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
			expect(cls.properties).lengthOf(1)

			let first = cls.properties[0]

			if (isPropertyDeclarationReflection(first)) {
				expect(first.name).to.equal('prop')
				expect(first.optional).to.false
				expect(typeRef(first.type)).to.equal(cls.selfRef.id)
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
