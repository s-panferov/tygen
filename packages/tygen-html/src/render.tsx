import React from 'react'

import { ReflectionKind, Reflection } from '@tygen/reflector'

import { PackagePage } from './package'
import { ModulePage } from './module'
import { InterfacePage } from './interface'
import { BaseView, ViewContext } from './view'
import { VariablePage } from './variable'
import { FolderPage } from './folder'
import { FunctionPage } from './function'
import { TypeAliasPage } from './type-alias'
import { EnumPage } from './enum'
import { ReactConverterSettings } from './settings'
import { InventoryPage } from './inventory'
import { SearchPage } from './ui/search'

const { hot } = require('react-hot-loader')

export function renderPage(ref: Reflection): React.ReactElement<any> {
	switch (ref.kind) {
		case ReflectionKind.Package:
			return <PackagePage reflection={ref} />
		case ReflectionKind.Folder:
			return <FolderPage reflection={ref} />
		case ReflectionKind.ESModule:
		case ReflectionKind.AmbientModule:
		case ReflectionKind.DeclarationFile:
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
		case ReflectionKind.Enum:
			return <EnumPage reflection={ref} />
		case ReflectionKind.Inventory:
			return <InventoryPage reflection={ref} />
		case ReflectionKind.Search:
			return <SearchPage reflection={ref} />
	}
	return <div>Unknown {ref.kind}</div>
}

class PageView_ extends BaseView<Reflection, { settings: ReactConverterSettings }> {
	render() {
		return (
			<ViewContext.Provider value={this.props.settings}>
				{renderPage(this.props.reflection)}
			</ViewContext.Provider>
		)
	}
}

export const PageView = hot(module)(PageView_)
