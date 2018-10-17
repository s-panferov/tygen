import * as path from 'path'

import { FileSystem, reflectToMemory } from '@tygen/reflector/runtime'

describe('pkg1', () => {
	let fileSystem: FileSystem
	beforeAll(() => {
		fileSystem = reflectToMemory(path.join(__dirname, '..', '..', 'structure', 'package'))
	})

	it('works', () => {
		const reflection = JSON.parse(
			fileSystem.readFileSync('/example/1.0.0/index.json').toString()
		)

		expect(reflection).toEqual({
			kind: 'Package',
			id: [
				{
					kind: 'Package',
					name: 'example',
					version: '1.0.0',
					fileName: 'example/1.0.0',
					anchor: 'example-1-0-0'
				}
			],
			manifest: {
				name: 'example',
				version: '1.0.0',
				main: 'src/folder1/index.ts'
			},
			modules: [
				{
					kind: 'Folder',
					name: 'src',
					fileName: 'example/1.0.0/(Folder)src',
					anchor: 'folder-src',
					children: [
						{
							kind: 'Folder',
							name: 'folder1',
							fileName: 'example/1.0.0/(Folder)src/(Folder)folder1',
							anchor: 'folder-folder1',
							children: [
								{
									kind: 'Folder',
									name: 'folder2',
									fileName:
										'example/1.0.0/(Folder)src/(Folder)folder1/(Folder)folder2',
									anchor: 'folder-folder2',
									children: [
										{
											name: 'decl.d.ts',
											kind: 'DeclarationFile',
											fileName:
												'example/1.0.0/(Folder)src/(Folder)folder1/(Folder)folder2/(DeclarationFile)decl.d.ts',
											anchor: 'declarationfile-decl-d-ts'
										},
										{
											name: 'index.ts',
											kind: 'ESModule',
											fileName:
												'example/1.0.0/(Folder)src/(Folder)folder1/(Folder)folder2/(ESModule)index.ts',
											anchor: 'esmodule-index-ts'
										}
									]
								},
								{
									name: 'index.ts',
									kind: 'ESModule',
									fileName:
										'example/1.0.0/(Folder)src/(Folder)folder1/(ESModule)index.ts',
									anchor: 'esmodule-index-ts'
								}
							]
						}
					]
				}
			],
			globals: [
				{
					kind: 'Link',
					target: {
						kind: 'AmbientModule',
						name: 'ambient-module',
						fileName: 'example/1.0.0/(AmbientModule)ambient-module',
						anchor: 'ambientmodule-ambient-module'
					}
				},
				{
					kind: 'Link',
					target: {
						kind: 'Namespace',
						name: 'AmbientNamespace',
						fileName: 'example/1.0.0/(Namespace)AmbientNamespace',
						anchor: 'namespace-ambientnamespace'
					}
				}
			],
			main: {
				kind: 'Link',
				target: {
					name: 'index.ts',
					kind: 'ESModule',
					fileName: 'example/1.0.0/(Folder)src/(Folder)folder1/(ESModule)index.ts',
					anchor: 'esmodule-index-ts'
				}
			},
			exports: [
				{
					kind: 'Link',
					target: {
						kind: 'Variable',
						name: 'a',
						fileName:
							'example/1.0.0/(Folder)src/(Folder)folder1/(ESModule)index.ts/(Variable)a',
						anchor: 'variable-a'
					}
				}
			]
		})
	})
})
