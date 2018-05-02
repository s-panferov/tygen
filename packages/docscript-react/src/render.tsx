import React from 'react'

import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { PackagePage } from './package'
import { ModulePage } from './module'
import { InterfacePage } from './interface'
import { BaseView, ViewContext } from './view'
import { VariablePage, VariableView } from './variable'
import { FolderPage } from './folder'
import { PropertyView } from './property'
import { MethodView } from './method'
import { SignatureView } from './signature'
import { FunctionPage } from './function'
import { TypeAliasPage } from './type-alias'

export function renderPage(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackagePage reflection={ref} />
		case ReflectionKind.Folder:
			return <FolderPage reflection={ref} />
		case ReflectionKind.ESModule:
		case ReflectionKind.Module:
		case ReflectionKind.Namespace:
			return <ModulePage reflection={ref} />
		case ReflectionKind.Interface:
		case ReflectionKind.Class:
			return <InterfacePage reflection={ref} />
		case ReflectionKind.Variable:
			return <VariablePage reflection={ref} />
		case ReflectionKind.Function:
			return <FunctionPage reflection={ref} />
		case ReflectionKind.TypeAlias:
			return <TypeAliasPage reflection={ref} />
	}
	return <div>Unknown</div>
}

export class PageView extends BaseView<Reflection> {
	render() {
		return (
			<ViewContext.Provider value={{}}>
				{renderPage(this.props.reflection)}
			</ViewContext.Provider>
		)
	}
}

export class ReflectionView extends BaseView<Reflection> {
	render() {
		const { reflection: ref } = this.props
		switch (ref.kind) {
			case ReflectionKind.Variable:
			case ReflectionKind.Parameter:
				return <VariableView reflection={ref} />
			case ReflectionKind.Property:
				return <PropertyView reflection={ref} />
			case ReflectionKind.Method:
				return <MethodView reflection={ref} />
			case ReflectionKind.Signature:
				return <SignatureView reflection={ref} />
		}
		return <div>Unknown</div>
	}
}
