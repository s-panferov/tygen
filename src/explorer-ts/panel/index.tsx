import * as React from 'react'
import * as theme from '../../explorer/components/theme'

require('./index.css')
const block = theme.block('ts-panel')

import Figure from '../../explorer/components/figure'
import Paper from '../../explorer/components/paper'

export interface PanelProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	title: React.ReactNode
	figure?: React.ReactNode
	inline?: boolean
	id?: string
}

export interface PanelState { }

export default class Panel extends React.Component<PanelProps, PanelState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this), {
		}).mix(this.props.className)
	}

	render() {
		if (!this.props.inline) {
			return (
				<Paper id={this.props.id} block={true} className={this.getClassName()}>
					{
						this.props.title &&
						<div className={block('heading')}>
							{this.props.title}
						</div>
					}
					<div className={block('content')}>
						{
							this.props.figure &&
							<Figure>
								{this.props.figure}
							</Figure>
						}
						{this.props.children}
					</div>
				</Paper>
			)
		} else {
			return (
				this.props.figure
			)
		}
	}
}
