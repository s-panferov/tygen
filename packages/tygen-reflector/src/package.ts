import * as path from 'path'
import * as fs from 'fs'
import { SourceFileMeta } from './file'
import { ReflectionKind } from './reflection/reflection'
import { Context } from './context'
import { createLink } from './reflection/utils'

const closest = require('pkg-up')
import log from 'roarr'

import {
	Manifest,
	PackageReflection,
	ReflectionWithReadme,
	ReflectionWithStructure,
	FolderReflection,
	ReflectionIdWithChildren
} from './reflection/package'

import { ESModuleReflection } from './reflection'
import { createMemoryFileSystem } from './helpers'
import { stringifyId, concatIdentifier } from './reflection/identifier'

export interface PackageFields {
	folderPath: string
	manifestFilePath: string
	manifest: Manifest
	files: Map<string, SourceFileMeta>
}

export interface Package extends PackageFields {}

export class Package {
	volume = createMemoryFileSystem()
	reflection!: PackageReflection

	constructor(contents: PackageFields) {
		this.folderPath = contents.folderPath
		this.manifestFilePath = contents.manifestFilePath
		this.manifest = contents.manifest
		this.files = contents.files
	}

	/**
	 * Extract package information for fileName
	 */
	static fromPath(fileName: string, cache?: Map<string, Package>): Package {
		// TODO cache
		const manifestFilePath = closest.sync(path.dirname(fileName))
		const folderPath = path.dirname(manifestFilePath)

		const existed = cache && cache.get(folderPath)
		if (existed) {
			return existed
		}

		return new Package({
			manifestFilePath,
			folderPath,
			manifest: JSON.parse(fs.readFileSync(manifestFilePath).toString()),
			files: new Map()
		})
	}

	addFile(mod: SourceFileMeta) {
		this.files.set(mod.sourceFile.fileName, mod)
	}

	generate(ctx: Context) {
		const packageRef: PackageReflection = {
			kind: ReflectionKind.Package,
			id: concatIdentifier([], {
				kind: ReflectionKind.Package,
				name: this.manifest.name,
				version: this.manifest.version
			}),
			manifest: this.manifest,
			modules: []
		}

		this.reflection = packageRef
		ctx.registerReflectionWithoutSymbol(packageRef)

		const files = Array.from(this.files.values()).filter(file => file.included)

		if (files.length > 0) {
			files.forEach(file => {
				log.info({ fileName: file.sourceFile.fileName }, 'Generate module')
				file.generate(ctx)
			})
		}

		files.forEach(mod => {
			this.volume.mkdirpSync(path.dirname(mod.pathInfo.relativePath))
			this.volume.writeFileSync(mod.pathInfo.relativePath, stringifyId(mod.reflection.id!))
		})

		visitReadme(this.folderPath, packageRef)
		packageRef.modules = visitFolders(this.volume, packageRef, ctx)

		if (this.manifest.main && this.volume.existsSync(this.manifest.main)) {
			const id = this.volume.readFileSync(this.manifest.main).toString()
			const ref = ctx.reflectionById.get(id)!
			const refLink = createLink(ref)
			packageRef.main = refLink
			packageRef.exports = (ref as ESModuleReflection).exports
		}

		if (this.manifest.typings && this.volume.existsSync(this.manifest.typings)) {
			const id = this.volume.readFileSync(this.manifest.typings).toString()
			const ref = createLink(ctx.reflectionById.get(id)!)
			packageRef.main = ref
		}
	}
}

function visitReadme(folderPath: string, parent: ReflectionWithReadme) {
	const files = fs.readdirSync(folderPath)
	const readmeIndex = files.findIndex(file => file.toLowerCase() === 'readme.md')
	if (readmeIndex !== -1) {
		const readmePath = path.join(folderPath, files[readmeIndex])
		const readmeContent = fs.readFileSync(readmePath).toString()
		parent.readme = readmeContent
	}
}

export function visitFolders(
	volume: typeof fs,
	parent: ReflectionWithStructure,
	ctx: Context,
	root = '.',
	_isRoot: boolean = true
): ReflectionIdWithChildren[] {
	const res = volume.readdirSync(root)
	const ids = [] as ReflectionIdWithChildren[]

	// first walk over directories
	res.forEach(item => {
		const fullPath = path.join(root, item)
		if (volume.statSync(fullPath).isDirectory()) {
			const folderRef: FolderReflection = {
				id: concatIdentifier(parent.id || [], {
					kind: ReflectionKind.Folder,
					name: item
				}),
				kind: ReflectionKind.Folder,
				name: item
			}

			ctx.registerReflectionWithoutSymbol(folderRef)

			const id = Object.assign({
				...(folderRef.id[folderRef.id.length - 1] as ReflectionIdWithChildren)
			})

			id.children = folderRef.modules = visitFolders(volume, folderRef, ctx, fullPath, false)
			ids.push(id)
		}
	})

	// then walk over files
	res.forEach(item => {
		const fullPath = path.join(root, item)

		if (volume.statSync(fullPath).isFile()) {
			const reflectionId = volume.readFileSync(fullPath).toString()
			const ref = ctx.reflectionById.get(reflectionId)
			if (!ref) {
				throw new Error('Unknown reflection')
			}
			const link = createLink(ref)
			const id = link.target as ReflectionIdWithChildren
			ids.push(id)
		}
	})

	return ids
}
