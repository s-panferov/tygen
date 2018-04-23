import { file, clear, defaultSetup, compile } from '../test'

describe(__filename, () => {
	beforeAll(clear)
	it('works', () => {
		defaultSetup()

		file(
			'src/test1.ts',
			`
				export interface Test {
					a: {
						test: Error
					}
				}
			`
		)

		file(
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

		compile()
	})
})
