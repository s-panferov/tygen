import * as React from 'react'
import * as theme from '../theme'

import { Route, PluginRegistry } from '../../state'
import { DisplaySettings } from '../../settings'

import { ModuleInfo } from '../../../doc/index'
import { Item } from '../../../doc/items'

require('./index.css')
const block = theme.block('module')

export interface ModuleProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	route: Route
	displaySettings: DisplaySettings
	module: ModuleInfo
	item: Item
	plugins: PluginRegistry

	onNavigate: (route: Route) => void
}
export interface ModuleState {}

export default class Module extends React.Component<ModuleProps, ModuleState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		return (
			<div className={this.getClassName()}>
				<div className={block('content')}>{this.renderView()}</div>
			</div>
		)
	}

	renderView(): React.ReactNode {
		let { module, plugins } = this.props

		if (this.props.module) {
			let Component = plugins.getModuleComponent(module)
			return (
				<Component
					className={block('view')}
					route={this.props.route}
					displaySettings={this.props.displaySettings}
					item={this.props.item}
					module={module}
				/>
			)
		}
	}
}
