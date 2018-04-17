import { generateInline, expect, coreType } from './utils'
import { CoreType } from '../tools'
import { isTypeQueryReflection } from '../ast/type/type-query'
import { isFunctionReflection } from '../ast/function'

describe('type-query', () => {
	let module = generateInline(`
		class Test {

		}

		function test(a: typeof undefined): typeof Test {
			return null
		}
	`)

	let klass = module.items[0]
	let func = module.items[1]

	it('reflects type queries', () => {
		if (isFunctionReflection(func)) {
			let returnType = func.callSignatures[0].type
			if (isTypeQueryReflection(returnType)) {
				expect(returnType.exprName).to.eq('Test')
				expect(returnType.ref.id).eq(klass.selfRef.id)
			} else {
				expect.fail()
			}

			let paramType = func.callSignatures[0].parameters[0].type
			if (isTypeQueryReflection(paramType)) {
				expect(paramType.exprName).eq('undefined')
				expect(paramType.ref).not.ok
			}
		} else {
			expect.fail()
		}
	})
})
