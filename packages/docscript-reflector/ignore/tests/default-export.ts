import { generateInline, expect, coreType } from './utils'
import { CoreType } from '../tools'
import { isFunctionReflection } from '../ast/function'
import { isClassReflection } from '../ast/class'

describe('default export', () => {
	it('reflect function semanticId and name', () => {
		let module = generateInline(`
			export default function test() { }
		`)
		let func = module.items[0]

		if (isFunctionReflection(func)) {
			expect(func.name).eq('test')
			expect(func.selfRef.semanticId).eq('test')
			expect(func.selfRef.mainSemanticId).eq('test')
		} else {
			expect.fail()
		}
	})

	it('reflect class semanticId and name', () => {
		let module = generateInline(`
			export default class Test {}
		`)
		let cls = module.items[0]

		if (isClassReflection(cls)) {
			expect(cls.name).eq('Test')
			expect(cls.selfRef.semanticId).eq('Test')
			expect(cls.selfRef.mainSemanticId).eq('Test')
		} else {
			expect.fail()
		}
	})
})
