import { generateInline, expect, coreType } from './utils'
import { CoreType } from '../tools'
import {
	isTypeAliasDeclarationReflection
} from '../ast/type-alias'

import {
	isTupleTypeReflection
} from '../ast/type/tuple'

describe('tuple-type', () => {
	let module = generateInline(`
		type Test = [string, number]
	`)

	let alias = module.items[0]

	it('reflection', () => {
		if (isTypeAliasDeclarationReflection(alias)) {
			let type = alias.type
			if (isTupleTypeReflection(type)) {
				expect(coreType(type.elementTypes[0])).equal(CoreType.String)
				expect(coreType(type.elementTypes[1])).equal(CoreType.Number)
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
