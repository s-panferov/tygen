import * as path from 'path'
import { Context, Module } from '../..'
import { expect } from '../utils'
import { generateFiles } from '../../helpers'

function findModule(pathWithPackage: string, ctx: Context): Module {
	for (let key of Object.keys(ctx.modules)) {
		let module = ctx.modules[key]
		if (module.fileInfo.withPackage === pathWithPackage) {
			return module
		}
	}
}

describe('definitions', () => {
	let ctx = generateFiles(
		[
			path.join(process.cwd(), 'src', 'doc', 'tests', 'namespaces', '_module.ts'),
			path.join(process.cwd(), 'src', 'doc', 'tests', 'namespaces', 'typings', 'react.d.ts')
		],
		'docscript'
	)

	it('compiles', () => {
		expect(ctx).ok
	})

	it('JSX', () => {
		let module = findModule('docscript:///src/doc/tests/namespaces/typings/react.d.ts/JSX', ctx)
		expect(module).ok
		expect(module.internal).true
		expect(module.items).lengthOf(6)
	})

	it('___React', () => {
		let module = findModule(
			'docscript:///src/doc/tests/namespaces/typings/react.d.ts/___React',
			ctx
		)
		expect(module).ok
		expect(module.internal).true
		expect(module.items).lengthOf(72)
	})

	it('test/item/deep', () => {
		let module = findModule(
			'docscript:///src/doc/tests/namespaces/_module.ts/test/item/deep',
			ctx
		)
		expect(module).ok
		expect(module.internal).true
		expect(module.items).lengthOf(1)
	})

	it('test/item', () => {
		let module = findModule('docscript:///src/doc/tests/namespaces/_module.ts/test/item', ctx)
		expect(module).ok
		expect(module.internal).true
		expect(module.items).lengthOf(0)
	})

	it('test', () => {
		let module = findModule('docscript:///src/doc/tests/namespaces/_module.ts/test/item', ctx)
		expect(module).ok
		expect(module.internal).true
		expect(module.items).lengthOf(0)
	})
})
