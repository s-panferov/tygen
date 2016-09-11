import * as path from 'path'
import * as fs from 'fs'
import { spawn } from 'child_process'
import { ItemType } from './items'
import { Context } from './index'
import { extractPackage } from './utils'
import sizeof from '../lib/sizeof'

let fse = require('fs-extra')

let INCLUDE_ITEMS = {
	[ItemType.Interface]: true,
	[ItemType.Class]: true,
	[ItemType.EnumDeclaration]: true,
	[ItemType.TypeAlias]: true,
	[ItemType.Function]: true,
	[ItemType.Method]: true,
	[ItemType.PropertyDeclaration]: true,
}

export class DocWriter {
	context: Context

	constructor(context: Context) {
		this.context = context
	}

	generateIdMap(): any[] {
		let flatItems: any[] = []

		function walkObject(
			obj: any,
			pkg: string,
			path: string,
			inMain: boolean,
			nesting: string[] = []
		) {
			if (obj.selfRef && obj.itemType) {
				if (inMain && INCLUDE_ITEMS[obj.itemType]) {
					flatItems.push(
						`${pkg}://${path}#${obj.selfRef.semanticId}`
					)
				}
			}

			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					let o = obj[key]
					if (o != null &&
						typeof o === 'object' &&
						(Array.isArray(o) ||
							Object.prototype.toString.call(o) === '[object Object]')) {
						walkObject(o, pkg, path, inMain, nesting)
					}
				}
			}
		}

		let modules = this.context.modules
		Object.keys(modules).forEach(moduleKey => {
			let module = modules[moduleKey]
			let inMain = module.pkgName == this.context.mainPackage

			module.items.forEach(item => {
				walkObject(
					item,
					module.pkgName,
					module.fileInfo.relativeToPackage,
					inMain
				)
			})
		})

		return flatItems
	}

	ensureDir(dir: string) {
		fse.removeSync(dir)
		fse.ensureDirSync(dir)
	}

	writeModules(dir: string, generateSearchIndex = true): Promise<any> {
		this.ensureDir(dir)

		let modules = this.context.modules
		Object.keys(modules).forEach(moduleKey => {
			let module = modules[moduleKey]

			// approximate unzipped size in megabytes
			let size = sizeof(module) / 1024 / 1024
			let shortForm = size <= 10

			module.shortForm = shortForm

			let metaPath = path.join(dir, module.fileInfo.metaName)
			fs.writeFileSync(metaPath, JSON.stringify(module, null, 4))

			if (!shortForm) {
				let itemsPath = metaPath.replace('.json', '')
				fse.ensureDirSync(itemsPath)
				module.items.forEach(item => {
					let itemPath = path.join(itemsPath, (item.selfRef.semanticId || item.selfRef.id) + '.json')
					fs.writeFileSync(itemPath, JSON.stringify(item, null, 4))
				})
			}
		})

		let [regModule, flatItems] = this.generateRegistryModule(dir)
		fs.writeFileSync(path.join(dir, 'registry.json'), regModule)

		let flow: Promise<any>
		if (generateSearchIndex) {
			flow = this.generateSearchIndex(dir, flatItems, () => { })
		} else {
			flow = Promise.resolve()
		}

		return flow.then(() => this.deflate(dir))
	}

	deflate(dir): Promise<any> {
		return new Promise((resolve, reject) => {
			console.log('spawn gzip')
			let gzip = spawn('gzip', ['-r', '-9', dir])

			gzip.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`)
			})

			gzip.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`)
			})

			gzip.on('close', (code) => {
				console.log(`gzip exited with code ${code}`)
				resolve()
			})
		})
	}

	generateSearchIndex(dir: string, flatItems: any[], cb: () => void): Promise<any> {
		let indexPath = path.join(dir, 'search-index.json')
		return new Promise((resolve, reject) => {
			fs.writeFile(indexPath, JSON.stringify(flatItems, null, 4), (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	generateRegistryModule(dir: string): [string, any[]] {
		let flatItems = this.generateIdMap()

		let modules = this.context.modules
		let files: any = {}
		Object.keys(modules).forEach(moduleKey => {
			let module = modules[moduleKey]
			files[module.fileInfo.withPackage] = module.shortForm
		})

		let packagesInfo = {}
		for (let key of Object.keys(this.context.packages)) {
			packagesInfo[key] = this.context.packages[key].info
		}

		let buf = `
{\n
    "mainPackage": "${extractPackage(dir).info.name}",
    "packages": ${ JSON.stringify(packagesInfo, null, 4)},
    "files": ${ JSON.stringify(files, null, 4)}
}`

		return [buf, flatItems]
	}

}
