import React from 'react'

import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { PackageView } from './package'
import { ModuleView } from './module'
import { InterfaceView } from './interface'
import { BaseView } from './view'
import { VariableView } from './variable'

export function renderReflection(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackageView reflection={ref} />
		case ReflectionKind.ESModule:
			return <ModuleView reflection={ref} />
		case ReflectionKind.Interface:
			return <InterfaceView reflection={ref} />
		case ReflectionKind.Variable:
			return <VariableView reflection={ref} />
	}
	return <div>Unknown</div>
}

export class ReflectionView extends BaseView<Reflection> {
	render() {
		return renderReflection(this.props.reflection)
	}
}
