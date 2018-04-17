import * as path from 'path'
import * as fs from 'fs'
import { Module } from './module'

const closest = require('pkg-up')

export class Package {
	folderPath: string
	manifestFilePath: string
	manifest: {
		name: string
		version: string
	}

	modules: Map<string, Module>

	constructor(contents: Package) {
		this.folderPath = contents.folderPath
		this.manifestFilePath = contents.manifestFilePath
		this.manifest = contents.manifest
		this.modules = contents.modules
	}

	/**
	 * Extract package information for fileName
	 */
	static fromPath(fileName: string, cache?: Map<string, Package>): Package {
		// TODO cache
		let manifestFilePath = closest.sync(path.dirname(fileName))
		let folderPath = path.dirname(manifestFilePath)

		let existed = cache && cache.get(folderPath)
		if (existed) {
			return existed
		}

		return new Package({
			manifestFilePath,
			folderPath,
			manifest: JSON.parse(fs.readFileSync(manifestFilePath).toString()),
			modules: new Map()
		})
	}
}
