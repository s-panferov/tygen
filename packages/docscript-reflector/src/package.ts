import * as path from 'path'
import * as fs from 'fs'
import { Module } from './module'
import {
	BaseReflection,
	ReflectionKind,
	ReflectionLink,
	createLink,
	Reflection
} from './reflection/reflection'
import { REFUSED } from 'dns'
import { Context } from './context'

const closest = require('pkg-up')

export interface PackageReflection extends BaseReflection {
	kind: ReflectionKind.Package
	manifest: Manifest
	readme?: string
	modules: Reflection[]
}

export interface Manifest {
	name: string
	version: string
}

export interface PackageFields {
	folderPath: string
	manifestFilePath: string
	manifest: Manifest
	modules: Map<string, Module>
}

export interface Package extends PackageFields {}

export class Package {
	constructor(contents: PackageFields) {
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

	generate(ctx: Context) {
		let packageRef: PackageReflection = {
			kind: ReflectionKind.Package,
			id: `${this.manifest.name}/${this.manifest.version}`,
			manifest: this.manifest,
			modules: []
		}

		ctx.registerReflectionById(packageRef)

		this.modules.forEach(module => {
			packageRef.modules.push(createLink(module.reflection))
		})

		let files = fs.readdirSync(this.folderPath)
		let readmeIndex = files.findIndex(file => file.toLowerCase() === 'readme.md')
		if (readmeIndex !== -1) {
			let readmePath = path.join(this.folderPath, files[readmeIndex])
			let readmeContent = fs.readFileSync(readmePath).toString()
			packageRef.readme = readmeContent
		}
	}
}
