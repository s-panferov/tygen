import { generateInline, expect, coreType } from './utils'
import { CoreType } from '../tools'
import { isTypeAliasDeclarationReflection } from '../ast/type-alias'

import { isUnionTypeReflection } from '../ast/type/intersection-union'

import { isParenthesizedTypeReflection } from '../ast/type/parenthesized'

describe('parenthesized-type', () => {
	let module = generateInline(`
		type Test = (string | number)
	`)

	let alias = module.items[0]

	it('reflection', () => {
		if (isTypeAliasDeclarationReflection(alias)) {
			let type = alias.type
			if (isParenthesizedTypeReflection(type)) {
				let uType = type.type
				if (isUnionTypeReflection(uType)) {
					expect(coreType(uType.types[0])).equals(CoreType.String)
					expect(coreType(uType.types[1])).equals(CoreType.Number)
				}
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
