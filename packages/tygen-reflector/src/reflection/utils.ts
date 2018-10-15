import {
	Reflection,
	ReflectionLink,
	NotIncludedReflection,
	ReflectionKind,
	BaseReflection
} from './reflection'
import { idFromPath } from './identifier'

export const ExcludedFlag = Symbol('Excluded')

export interface ExcludedReflection extends BaseReflection {
	[ExcludedFlag]?: boolean
}

export function createLink(ref: Reflection): ReflectionLink | NotIncludedReflection {
	if (ref.kind === ReflectionKind.Link || ref.kind === ReflectionKind.NotIncluded) {
		return ref
	} else if (ref.id) {
		const summary = extractSummary(ref)
		if ((ref as ExcludedReflection)[ExcludedFlag]) {
			return <NotIncludedReflection>{
				kind: ReflectionKind.NotIncluded,
				target: idFromPath(ref.id),
				tags: summary ? [{ name: 'summary', text: summary }] : undefined
			}
		} else {
			return <ReflectionLink>{
				kind: ReflectionKind.Link,
				target: idFromPath(ref.id),
				tags: summary ? [{ name: 'summary', text: summary }] : undefined
			}
		}
	} else {
		throw new Error('Cannot create a link to the reflection')
	}
}

export function extractSummary(ref: Reflection): string | undefined {
	if (ref.tags) {
		const summary = ref.tags.find(tag => tag.name === 'summary')
		if (summary) {
			return summary.text
		}
	} else if (ref.comments) {
		const doc = ref.comments.find(comment => comment.kind === 'text')
		if (doc) {
			return doc.text.split('\n', 1)[0].slice(0, 200)
		}
	}
}
