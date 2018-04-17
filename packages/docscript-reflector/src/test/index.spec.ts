import { file, clear, defaultSetup, compile } from '../test'

describe(__filename, () => {
	beforeAll(clear)
	it('works', () => {
		defaultSetup()

		let testFile1 = file(
			'src/test1.ts',
			`
				export interface Test {
					a: {
						test: Error
					}
				}
			`
		)

		let testFile2 = file(
			'src/test2.ts',
			`
				import { Test } from './test1'

				declare module './test1' {
					export interface Test {
						b: 1
					}
				}
			`
		)

		let ctx = compile()
	})
})
