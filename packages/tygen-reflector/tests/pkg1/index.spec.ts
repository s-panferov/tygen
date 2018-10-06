import path from 'path'
import {
	compileFolder,
	Writer,
	createMemoryFileSystem,
	ReflectionKind
} from '@tygen/reflector/runtime'

it('works', () => {
	const ctx = compileFolder(path.join(__dirname, 'package'))
	const fileSystem = createMemoryFileSystem()
	const writer = new Writer(ctx, '/', fileSystem)
	writer.writeReflections()

	expect(JSON.parse(fileSystem.readFileSync('/example/1.0.0/index.json').toString())).toEqual({
		kind: ReflectionKind.Package,
		id: 'example->1.0.0',
		manifest: { name: 'example', version: '1.0.0', main: 'index.ts' },
		modules: [
			{
				kind: ReflectionKind.Link,
				target: 'example->1.0.0->index.ts',
				targetKind: ReflectionKind.ESModule
			}
		],
		main: {
			kind: ReflectionKind.Link,
			target: 'example->1.0.0->index.ts',
			targetKind: ReflectionKind.ESModule
		},
		exports: [
			{
				kind: ReflectionKind.Link,
				target: 'example->1.0.0->index.ts->a',
				targetKind: ReflectionKind.Variable
			}
		]
	})
})
