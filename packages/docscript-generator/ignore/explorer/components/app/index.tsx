import * as React from 'react'
import * as theme from '../theme'
import { connect, DispatchProps, actions } from '../../redux'
import { History } from 'history'

import autobind from '../../../lib/autobind'

import Service, { Route } from '../../service'
import { PluginRegistry } from '../../state'

const block = theme.block('app')
require('./index.css')

import { ModuleInfo } from '../../../doc'
import { Item } from '../../../doc/items'
import { DisplaySettings } from '../../settings'

import Layout from '../layout'
import Module from '../module'
import Nav from '../nav'
import NProgress from '../nprogress'
import ActivityManager from '../../activity'
import Header from '../header'
import Hotkeys from '../hotkeys'
import FocalPoint from '../focal-point'

interface AppReduxProps extends DispatchProps {
	activity?: ActivityManager
	service?: Service
	route?: Route
	plugins?: PluginRegistry
	displaySettings?: DisplaySettings

	module?: ModuleInfo
	item?: Item
}

interface AppProps extends AppReduxProps {
	history: History
}

const KEY_MAP = {
	toggleSearch: ['`', ']']
}

@connect(({ activity, service, route, plugins, module, item, displaySettings }): AppReduxProps => {
	return { activity, service, route, plugins, module, item, displaySettings }
})
export default class App extends React.Component<AppProps, void> {
	static contextTypes = theme.themeContext
	handlers: any
	constructor(props, context) {
		super(props, context)
		this.toggleSearch = this.toggleSearch.bind(this)
		this.handlers = {
			toggleSearch: this.toggleSearch
		}
	}

	shouldComponentUpdate(nextProps: AppProps): boolean {
		if (
			this.props.route !== nextProps.route ||
			this.props.module !== nextProps.module ||
			this.props.item !== nextProps.item ||
			this.props.displaySettings !== nextProps.displaySettings
		) {
			return true
		} else {
			return false
		}
	}

	getClassName() {
		return block(theme.resolveTheme(this))
	}

	render() {
		return (
			<FocalPoint>
				<Hotkeys className={block('hotkeys')} keyMap={KEY_MAP} handlers={this.handlers}>
					<div className={this.getClassName()}>
						<NProgress activity={this.props.activity} />
						<Header
							route={this.props.route}
							displaySettings={this.props.displaySettings}
							onNavigate={this.onNavigate}
							onChangeDisplaySettings={this.onChangeDisplaySettings}
						/>
						<Layout
							className={block('layout')}
							sidebar={
								<Nav
									route={this.props.route}
									service={this.props.service}
									onNavigate={this.onNavigate}
								/>
							}>
							<Module
								plugins={this.props.plugins}
								route={this.props.route}
								module={this.props.module}
								displaySettings={this.props.displaySettings}
								item={this.props.item}
								onNavigate={this.onNavigate}
							/>
						</Layout>
					</div>
				</Hotkeys>
			</FocalPoint>
		)
	}

	toggleSearch() {
		this.props.dispatch(actions.toggleSearch())

		return false
	}

	@autobind
	onChangeDisplaySettings(settings: DisplaySettings) {
		this.props.dispatch(actions.changeDisplaySettings(settings))
	}

	@autobind
	onNavigate(route: Route) {
		this.props.dispatch(actions.navigate(route))
	}
}
