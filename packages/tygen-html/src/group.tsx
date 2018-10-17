import { Reflection, ReflectionKind } from '@tygen/reflector'
import { HeaderItem, ReflectionItem } from './structure'

export const SectionNames = {
	[ReflectionKind.Interface]: 'Interfaces',
	[ReflectionKind.Class]: 'Classes',
	[ReflectionKind.TypeAlias]: 'Type Aliases',
	[ReflectionKind.Function]: 'Functions',
	[ReflectionKind.Variable]: 'Variables',
	[ReflectionKind.ESModule]: 'Modules',
	[ReflectionKind.DeclarationFile]: 'Declaration Files',
	[ReflectionKind.AmbientModule]: 'Global modules',
	[ReflectionKind.Namespace]: 'Namespaces',
	getName(group: string): string {
		return (this as any)[group] || group
	}
}

export type GroupedReflections = { [key: string]: Reflection[] }

export function buildTreeByType(reflections: Reflection[]) {
	return extractStructure(groupReflections(reflections))
}

export function extractStructure(groups: GroupedReflections) {
	return Object.keys(groups).map(key => {
		const items = groups[key]
		return new HeaderItem(
			key,
			{
				kind: 'header',
				text: SectionNames.getName(key)
			},
			items.map(ReflectionItem.fromReflection)
		)
	})
}

export function groupReflections(reflections: Reflection[]): GroupedReflections {
	let groups: GroupedReflections = {}
	reflections.forEach(ref => {
		let kind: ReflectionKind = ref.kind
		if (ref.kind === ReflectionKind.Link) {
			kind = ref.target.kind
		}

		if (!groups[kind]) {
			groups[kind] = []
		}

		groups[kind].push(ref)
	})

	return groups
}
