import * as React from 'react'
import * as theme from '../theme'
import { connect, DispatchProps, actions } from '../../redux'
import autobind from '../../../lib/autobind'

require('./index.css')
const block = theme.block('smart-link')

import Link, { LinkProps } from '../link'
import { Route } from '../../state'
import Service from '../../service'

import { pathFromRoute } from '../../service'

interface SmartLinkReduxProps extends DispatchProps {
	service?: Service
	appRoute?: Route
}

export interface SmartLinkProps extends SmartLinkReduxProps, LinkProps, DispatchProps {
	route?: Route
	render?: (route: Route, linkProps: React.HTMLAttributes) => React.ReactElement<any>
}

export interface SmartLinkState {}

@connect(({ service, route }) => {
	return { service, appRoute: route } as SmartLinkReduxProps
})
export default class SmartLink extends React.Component<SmartLinkProps, SmartLinkState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this), {
			invalid: this.props.route.invalid
		}).mix(this.props.className)
	}

	render() {
		let route = this.props.route
		let htmlProps = Object.assign({}, this.props.htmlProps)

		if (!route.invalid) {
			htmlProps.onClick = this.onClick
			htmlProps.href = `#${pathFromRoute(route)}`
		}

		if (this.props.render) {
			return this.props.render(route, htmlProps)
		} else {
			return <Link {...this.props} {...{ htmlProps }} className={this.getClassName()} />
		}
	}

	@autobind
	onClick(e: React.MouseEvent) {
		e.preventDefault()

		this.props.dispatch(actions.navigate(this.props.route))
	}
}
