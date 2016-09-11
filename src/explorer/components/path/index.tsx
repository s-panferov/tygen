import * as React from 'react'
import * as theme from '../theme'
import * as path from 'path'

import File from '../file'

import { Route } from '../../state'

let block = theme.block('path')
require('./index.css')

export interface PathProps extends React.CommonProps {
	route: Route
	navigate: (route: Route) => void
}

export interface PathState { }

export class Path extends React.Component<PathProps, PathState> {
	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let { route } = this.props

		return (
			<div className={this.getClassName()}>
				<File
					name='packages'
					pkg={null}
					path={null}
					disabled={!route.pkg}
					className={block('item')}
					navigate={this.props.navigate}
					/>

				{
					route.pkg && <File
						name={route.pkg}
						pkg={route.pkg}
						path={'/'}
						className={block('item')}
						navigate={this.props.navigate}
						/>
				}

				{
					route.pkg && this.renderPath(route)
				}
			</div>
		)
	}

	renderPath(route: Route) {
		let pathSections = route.path.split(path.sep).filter(Boolean)

		return pathSections.map((item, i) => {
			let before = pathSections.slice(0, i + 1)
			before.unshift('/')
			let fullPath = path.join.apply(path, before)
			return (
				<File
					name={item}
					pkg={route.pkg}
					path={fullPath}
					className={block('item')}
					disabled={i == pathSections.length - 1}
					navigate={this.props.navigate}
					/>
			)
		})
	}
}
