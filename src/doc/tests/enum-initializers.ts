import { generateInline, expect } from './utils'
import {
	isEnumDeclarationReflection
} from '../ast/enum'

describe('enum:initializer', () => {
	let module = generateInline(`
		enum Test {
			A = 1,
			B = 'string' as any
		}
	`)

	let en = module.items[0]

	it('reflection', () => {
		expect(en.selfRef.id).to.ok
		expect(en.selfRef.semanticId).eq('Test')
		expect(en.name).to.equal('Test')
	})

	it('members', () => {
		if (isEnumDeclarationReflection(en)) {
			expect(en.members).lengthOf(2)

			expect(en.members[0].initializer).to.equal('1')
			expect(en.members[0].selfRef.semanticId).to.equal('Test.A')
			expect(en.members[1].initializer).to.equal('\'string\' as any')
			expect(en.members[1].selfRef.semanticId).to.equal('Test.B')
		} else {
			expect.fail()
		}
	})
})
