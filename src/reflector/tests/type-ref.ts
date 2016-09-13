import { generateInline, expect, coreType } from './utils'
import { CoreType } from '../tools'
import {
	isVariableDeclarationReflection
} from '../ast/var'
import {
	isTypeReferenceReflection
} from '../ast/type/type-reference'

describe('type-predicate', () => {
	let module = generateInline(`
		export namespace test {
			export namespace me {
				export namespace now {
					export interface Test{}
				}
			}
		}

		var a: test.me.now.Test
	`)

	let variable = module.items[0]

	it('ref', () => {
		if (isVariableDeclarationReflection(variable)) {
			let type = variable.type
			if (isTypeReferenceReflection(type)) {
				expect(type.ref.pkg).eq('docscript')
				expect(type.ref.semanticId).eq('Test')
				expect(type.ref.path.indexOf('.ts/test/me/now')).not.eq(-1)
			} else {
				expect(false).true
			}
		} else {
			expect(false).true
		}
	})
})
