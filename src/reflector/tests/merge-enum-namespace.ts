import { generateInline, expect } from './utils'
import {
	isEnumDeclarationReflection
} from '../ast/enum'

describe('enum-namespace-merge', () => {
	let module = generateInline(`
		enum Enum {
			Super = 'Super' as any,
			NotSuper = 'NotSuper' as any
		}
		namespace Enum {
			export function alarm() {
				return 'alarm'
			}
		}
	`)

	let en = module.items[0]
	let ns = module.items[1]

	xit('correctly merges signatures', () => {
		expect(en).to.ok
		expect(ns).to.not.ok

		if (isEnumDeclarationReflection(en)) {
			expect(en.members).lengthOf(2)
			expect(en.properties).lengthOf(6)
			expect(en.properties.find(p => p.name == 'alarm')).ok
		} else {
			expect.fail()
		}
	})
})
