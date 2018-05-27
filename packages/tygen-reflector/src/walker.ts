import * as path from 'path'
import * as fse from 'fs-extra'

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
			const folderName = path.dirname(fileName)
			const files = converter.visitReflection(ref, fileName, this)
			if (files) {
				writeFiles(folderName, files)
			}
		})
	}
}

export function writeFiles(baseFolder: string, files: File[]) {
	files.forEach(file => {
		const resultPath = path.resolve(baseFolder, file.name)
		fse.writeFileSync(resultPath, file.content)
	})
}

function walkFolder(targetFolder: string, cb: (fileName: string) => void) {
	let items = fse.readdirSync(targetFolder)

	let files: string[] = []
	let folders: string[] = []

	items.forEach(item => {
		let itemPath = path.join(targetFolder, item)
		let stat = fse.statSync(itemPath)

		if (stat.isDirectory()) {
			folders.push(itemPath)
		} else {
			files.push(itemPath)
		}
	})

	for (const item of files) {
		if (path.extname(item) === '.json') {
			cb(item)
		}
	}

	for (const item of folders) {
		walkFolder(item, cb)
	}
}
