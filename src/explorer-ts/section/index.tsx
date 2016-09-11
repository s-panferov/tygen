import * as React from 'react'
import * as theme from '../../explorer/components/theme'

require('./index.css')
const block = theme.block('ts-section')

export interface SectionProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	title: React.ReactNode
	lvl?: number
}

export interface SectionState { }

export default class Section extends React.Component<SectionProps, SectionState> {
	static contextTypes = theme.themeContext
	static defaultProps = {
		lvl: 1
	}

	getClassName() {
		return block(theme.resolveTheme(this), {
			'with-heading': !!this.props.title,
			lvl: this.props.lvl
		}).mix(this.props.className)
	}

	render() {
		return (
			<div className={this.getClassName()}>
				{
					this.props.title &&
					<div className={block('heading')}>
						{this.props.title}
					</div>
				}
				<div className={block('content')}>
					{this.props.children}
				</div>
			</div>
		)
	}
}
