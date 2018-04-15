import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as theme from '../../explorer/components/theme'

import StickyScroll from '../../explorer/components/sticky-scroll'
import SmartLink from '../../explorer/components/smart-link'
import ScrollSpy from 'rscrollspy'

import { Item } from '../../doc/items'

require('./index.css')
const block = theme.block('ts-type-nav')

export interface TypeNavProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	items: Item[]
}

export interface TypeNavState {
	sticky?: boolean
}

export default class TypeNav extends React.Component<TypeNavProps, TypeNavState> {
	static contextTypes = theme.themeContext

	refs: {
		[key: string]: React.Component<any, any>
		stickyScroll: StickyScroll
	}

	constructor(props, context) {
		super(props, context)

		this.state = {
			sticky: false
		}

		this.renderItems = this.renderItems.bind(this)
		this.onSpyChange = this.onSpyChange.bind(this)
	}

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		return (
			<StickyScroll ref="stickyScroll">
				<ScrollSpy
					ids={this.props.items.map(item => item.selfRef.id)}
					onChange={this.onSpyChange}>
					{this.renderItems}
				</ScrollSpy>
			</StickyScroll>
		)
	}

	renderItems(inView: string, outView: string) {
		let items = this.props.items.map(item => {
			let className = block('item', {
				active: inView.indexOf(item.selfRef.id) !== -1
			})

			let name = item.name
			if (!name) {
			}

			return (
				<div id={`nav-${item.selfRef.id}`} className={className} key={item.selfRef.id}>
					<SmartLink route={item.selfRef} className={block('link')}>
						{item.name}
					</SmartLink>
				</div>
			)
		})

		return <div>{items}</div>
	}

	onSpyChange(inView: string[]) {
		let id = inView[0]
		if (id) {
			let scrollComponent = this.refs.stickyScroll && this.refs.stickyScroll.getScroll()
			if (scrollComponent) {
				let scroll: HTMLElement = ReactDOM.findDOMNode(scrollComponent) as any
				let elem: HTMLElement = scroll.querySelector(`#nav-${id}`) as any
				let offsetTop = elem.offsetTop
				if (offsetTop > scroll.scrollTop + scroll.offsetHeight) {
					scroll.scrollTop = offsetTop
				} else if (offsetTop < scroll.scrollTop) {
					scroll.scrollTop = offsetTop - scroll.offsetHeight
				}
			}
		}
	}
}
