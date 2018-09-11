import * as path from 'path'
import * as fs from 'fs'
import { SourceFileMeta } from './file'
import { ReflectionKind, createLink } from './reflection/reflection'
import { Context } from './context'

const { Volume } = require('memfs')
const closest = require('pkg-up')

import {
	Manifest,
	PackageReflection,
	ReflectionWithReadme,
	ReflectionWithStructure,
	FolderReflection
} from './reflection/package'

export interface PackageFields {
	folderPath: string
	manifestFilePath: string
	manifest: Manifest
	files: Map<string, SourceFileMeta>
}

export interface Package extends PackageFields {}

export class Package {
	volume = Volume.fromJSON({}) as typeof fs & { mkdirpSync: (path: string) => void }

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
			id: `${this.manifest.name}->${this.manifest.version}`,
			manifest: this.manifest,
			modules: []
		}

		ctx.registerReflectionById(packageRef)

		this.files.forEach(mod => {
			this.volume.mkdirpSync(path.dirname(mod.pathInfo.relativePath))
			this.volume.writeFileSync(mod.pathInfo.relativePath, mod.reflection.id)
		})

		visitReadme(this.folderPath, packageRef)
		visitFolders(this.volume, packageRef, ctx)

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
	isRoot: boolean = true
) {
	const res = volume.readdirSync(root)

	// first walk over directories
	res.forEach(item => {
		const fullPath = path.join(root, item)
		if (volume.statSync(fullPath).isDirectory()) {
			const folderRef: FolderReflection = {
				id: `${parent.id}${isRoot ? '->' : '/'}${item}`,
				kind: ReflectionKind.Folder,
				name: item,
				modules: []
			}

			ctx.registerReflectionById(folderRef)
			visitFolders(volume, folderRef, ctx, fullPath, false)

			if (res.length === 1) {
				parent.modules.push(...folderRef.modules)
			} else {
				const ref = createLink(folderRef)
				parent.modules.push(ref)
			}
		}
	})

	// then walk over files
	res.forEach(item => {
		const fullPath = path.join(root, item)

		if (volume.statSync(fullPath).isFile()) {
			const id = volume.readFileSync(fullPath).toString()
			const ref = ctx.reflectionById.get(id)
			if (!ref) {
				throw new Error('Unknown reflection')
			}
			const link = createLink(ref)
			parent.modules.push(link)
		}
	})
}
