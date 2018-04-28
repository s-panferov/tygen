import React from 'react'

import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { PackagePage } from './package'
import { ModulePage } from './module'
import { InterfacePage } from './interface'
import { BaseView } from './view'
import { VariablePage, VariableView } from './variable'
import { FolderPage } from './folder'
import { PropertyView } from './property'
import { MethodView } from './method'
import { SignatureView } from './signature'
import { FunctionPage } from './function'

export function renderPage(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackagePage reflection={ref} />
		case ReflectionKind.Folder:
			return <FolderPage reflection={ref} />
		case ReflectionKind.ESModule:
			return <ModulePage reflection={ref} />
		case ReflectionKind.Interface:
			return <InterfacePage reflection={ref} />
		case ReflectionKind.Variable:
			return <VariablePage reflection={ref} />
		case ReflectionKind.Function:
			return <FunctionPage reflection={ref} />
	}
	return <div>Unknown</div>
}

export class PageView extends BaseView<Reflection> {
	render() {
		return renderPage(this.props.reflection)
	}
}

export class ReflectionView extends BaseView<Reflection> {
	render() {
		const { reflection: ref, nav } = this.props
		switch (ref.kind) {
			case ReflectionKind.Variable:
				return <VariableView reflection={ref} nav={nav} />
			case ReflectionKind.Property:
				return <PropertyView reflection={ref} nav={nav} />
			case ReflectionKind.Method:
				return <MethodView reflection={ref} nav={nav} />
			case ReflectionKind.Signature:
				return <SignatureView reflection={ref} nav={nav} />
		}
		return <div>Unknown</div>
	}
}
