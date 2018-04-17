import { generateInline, expect, coreType, typeRef } from './utils'
import { CoreType } from '../tools'
import { ItemType } from '../items'
import { isClassReflection } from '../ast/class'

import { HeritageClauseType } from '../ast/interface'

describe('interface-heritage', () => {
	let module = generateInline(`
		class Test<T> extends Base<string> {}
		class Base<T> {
			constructor() {}
		}
	`)

	let cls = module.items[0]
	let base = module.items[1]

	it('reflection', () => {
		if (isClassReflection(cls)) {
			if (isClassReflection(base)) {
				let hc = cls.heritageClauses[0]
				expect(hc.itemType).equal(ItemType.HeritageClause)
				expect(hc.clause).equal(HeritageClauseType.Extends)
				expect(typeRef(hc.types[0].expression.type)).equal(base.selfRef.id)
				expect(hc.types[0].expression.name).equal('Base')
				expect(coreType(hc.types[0].typeArguments[0])).equal(CoreType.String)
			} else {
				expect.fail()
			}
		} else {
			expect.fail()
		}
	})
})
