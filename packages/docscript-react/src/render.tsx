import React from 'react'

import { Reflection, ReflectionKind } from '@docscript/reflector'
import { PackageView } from './package'

export function renderReflection(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackageView reflection={ref} />
	}
	return <div>Unknown</div>
}
