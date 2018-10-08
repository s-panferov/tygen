import path from 'path'
import fs from 'fs'
import semver from 'semver'
import { InventoryReflection, InventoryPackage } from './reflection'
import { ReflectionKind } from '..'

export function updateInventory(outDir: string) {
	const packages: InventoryPackage[] = []

	function walkFolder(dir: string, scope?: string) {
		const contents = fs.readdirSync(dir)

		for (const pkg of contents) {
			const packagePath = path.join(dir, pkg)
			if (!fs.statSync(packagePath).isDirectory()) {
				continue
			}

			if (pkg.indexOf('@') !== -1) {
				walkFolder(packagePath, pkg)
			} else if (pkg[0] === '-' || pkg[0] === '_') {
				continue
			} else {
				const versions = semver
					.sort(
						fs.readdirSync(packagePath).filter(ver => {
							return fs.statSync(path.join(packagePath, ver)).isDirectory
						})
					)
					.reverse() as string[]

				const manifest = JSON.parse(
					fs.readFileSync(path.join(packagePath, versions[0], 'index.json')).toString()
				).manifest

				packages.push({
					name: scope ? `${scope}/${pkg}` : pkg,
					description: manifest.description,
					versions: versions
				})
			}
		}
	}

	walkFolder(outDir)

	const inventory: InventoryReflection = {
		kind: ReflectionKind.Inventory,
		packages
	}

	fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(inventory))
	return inventory
}
