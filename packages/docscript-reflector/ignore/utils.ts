import * as path from 'path'
import * as fs from 'fs'

import { Package, FileInfo } from './index'

export function extractPackage(fileName: string): Package {
	let pkgJson = closest.sync(path.dirname(fileName))
	return {
		path: path.dirname(pkgJson),
		info: JSON.parse(fs.readFileSync(pkgJson).toString())
	}
}

export function getFileInfo(fileName: string, pkg: Package): FileInfo {
	let relativeToPackage = path.relative(pkg.path, fileName)

	if (!/^(\.|\/)/.test(relativeToPackage)) {
		relativeToPackage = '/' + relativeToPackage
	}

	let withPackage = pkg.info.name + '://' + relativeToPackage
	let metaName = getMetaName(withPackage)

	return {
		metaName,
		relativeToPackage,
		withPackage
	}
}

export function getMetaName(withPackage: string) {
	return withPackage.replace(/\/|\\/g, '--') + '.json'
}

export function logNode(node) {
	let obj = Object.assign({}, node)
	delete obj.parent
	return console.log(obj)
}
