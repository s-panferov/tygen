import { BaseReflection, ReflectionKind } from '../reflection'

export interface InventoryReflection extends BaseReflection {
	kind: ReflectionKind.Inventory
	packages: InventoryPackage[]
}

export interface InventoryPackage {
	name: string
	description: string
	versions: string[]
}
