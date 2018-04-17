import { generateInline, expect, typeRef } from './utils'
import { isEnumDeclarationReflection } from '../ast/enum'

describe('enum:simple', () => {
	let module = generateInline(`
		enum Test {
			A,
			B,
			C
		}
	`)

	let en = module.items[0]

	it('reflection', () => {
		expect(en.selfRef.id).to.ok
		expect(en.name).to.equal('Test')
	})

	it('members', () => {
		if (isEnumDeclarationReflection(en)) {
			expect(en.members).lengthOf(3)

			expect(en.members[0].name).to.equal('A')
			expect(en.members[1].name).to.equal('B')
			expect(en.members[2].name).to.equal('C')
		} else {
			expect.fail()
		}
	})
})
