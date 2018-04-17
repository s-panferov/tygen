import * as React from 'react'
import * as ReactDOM from 'react-dom'

let stack: any[] = []

export default class FocalPoint extends React.Component<any, any> {
	refs: any

	anchor: any

	constructor(props, context) {
		super(props, context)

		this._onBlur = this._onBlur.bind(this)
	}

	contains(element) {
		return ReactDOM.findDOMNode(this.refs.root).contains(element)
	}

	focus() {
		return (ReactDOM.findDOMNode(this.refs.root) as any).focus()
	}

	componentDidMount() {
		stack.push(this)
		document.addEventListener('blur', this._onBlur, true)

		this.focus()
	}

	componentWillUnmount() {
		stack.pop()
		document.removeEventListener('blur', this._onBlur, true)

		stack[stack.length - 1].focus()
	}

	render() {
		let child = this.props.children
		return React.cloneElement(child, { ref: 'root' })
	}

	_onBlur(event) {
		let current = stack[stack.length - 1]
		if (current) {
			setTimeout(() => {
				if (!document.activeElement || !current.contains(document.activeElement)) {
					current.focus()
				}
			}, 10)
		}
	}
}
