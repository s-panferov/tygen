import { generateInline, expect } from './utils'
import { isInterfaceReflection } from '../ast/interface'
import { isFunctionReflection } from '../ast/function'

describe('export test', () => {
	it('marks interface as exported in external module .d.ts file', () => {
		let module = generateInline(`
			export interface IAmGlobalInterface { }
			declare function calc()
		`, '.d.ts')

		let iface = module.items[0]
		let func = module.items[1]

		if (isInterfaceReflection(iface)) {
			expect(iface.exported).true
		} else {
			expect.fail()
		}

		if (isFunctionReflection(func)) {
			expect(func.exported).false
		} else {
			expect.fail()
		}
	})

	it('marks everything as exported in ambient .d.ts file', () => {
		let module = generateInline(`
			interface IAmGlobalInterface { }
			declare function calc()
		`, '.d.ts')

		let iface = module.items[0]
		let func = module.items[1]

		if (isInterfaceReflection(iface)) {
			expect(iface.exported).true
		} else {
			expect.fail()
		}

		if (isFunctionReflection(func)) {
			expect(func.exported).true
		} else {
			expect.fail()
		}
	})

	it('marks everything as exported in ambient .d.ts file', () => {
		let module = generateInline(`
			declare module __React {
				export interface Test {}
			}
		`, '.d.ts')

		// FIXME @spanferov write tests
	})
})
