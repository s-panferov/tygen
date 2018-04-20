import * as path from 'path'
import * as fse from 'fs-extra'

import { Reflection } from './reflection/reflection'
import { File, Converter } from './converter'

export type ReflectionVisitor = () => File[] | undefined

export class ReflectionWalker {
	targetFolder: string

	constructor(targetFolder: string) {
		this.targetFolder = targetFolder
	}

	walk(converter: Converter) {
		walkFolder(this.targetFolder, fileName => {
			const ref = JSON.parse(fse.readFileSync(fileName).toString())
			const folderName = path.basename(fileName)
			const files = converter.visitReflection(ref, fileName, this)
			if (files) {
				files.forEach(file => {
					const resultPath = path.resolve(folderName, file.name)
					fse.writeFileSync(resultPath, file.content)
				})
			}
		})
	}
}

function walkFolder(targetFolder: string, cb: (fileName: string) => void) {
	let items = fse.readdirSync(targetFolder)
	for (const item of items) {
		let itemPath = path.join(targetFolder, item)
		let stat = fse.statSync(itemPath)
		if (stat.isDirectory()) {
			walkFolder(itemPath, cb)
		} else if (path.extname(itemPath) === '.json') {
			cb(itemPath)
		}
	}
}
