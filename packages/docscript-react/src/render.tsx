import React from 'react'

import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { PackageView } from './package'
import { ModuleView } from './module'

export function renderReflection(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackageView reflection={ref} />
		case ReflectionKind.ESModule:
			return <ModuleView reflection={ref} />
	}
	return <div>Unknown</div>
}
