import * as React from 'react'
import ActivityManager from '../../activity'

export interface NProgressProps extends React.CommonProps {
	activity: ActivityManager
}

export interface NProgressState {
	active: boolean
}

let nprogress = require('nprogress')
require('nprogress/nprogress.css')

export default class NProgress extends React.Component<NProgressProps, NProgressState> {
	constructor(props: NProgressProps, context) {
		super(props, context)
		this.onActivityChange = this.onActivityChange.bind(this)
		this.state = {
			active: this.props.activity.isActive()
		}
	}

	componentDidMount() {
		this.props.activity.registerCallback(this.onActivityChange)
		if (this.state.active) {
			this.setState({
				active: true
			})
		}
	}

	componentWillUnmount() {
		this.props.activity.unregisterCallback(this.onActivityChange)
	}

	componentWillUpdate(nextProps: NProgressProps, nextState: NProgressState) {
		if (nextState.active !== this.state.active) {
			if (nextState.active) {
				nprogress.start()
			} else {
				nprogress.done()
			}
		}
	}

	onActivityChange(active: boolean) {
		this.setState({
			active: active
		})
	}

	render() {
		return (
			<div style={{ display: 'none' }}></div>
		)
	}
}
