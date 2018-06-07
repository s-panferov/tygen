import * as React from 'react'
import { Code, InlineCode } from '../mdast'

const { default: SyntaxHighlighter } = require('react-syntax-highlighter/prism')

// import 'prismjs/themes/prism-funky.css'

export interface CodeUIProps {
	node: Code | InlineCode
}

export class CodeUI extends React.Component<CodeUIProps> {
	shouldComponentUpdate(nextProps: this['props']) {
		return (
			nextProps.node.value !== this.props.node.value ||
			(nextProps.node as Code).lang !== (this.props.node as Code).lang
		)
	}

	render() {
		const { node } = this.props
		const lang = node.type === 'code' ? node.lang : undefined
		const code = (
			<SyntaxHighlighter
				language={lang}
				useInlineStyles={false}
				PreTag={'span'}
				CodeTag={'span'}>
				{node.value}
			</SyntaxHighlighter>
		)

		if (node.type === 'code') {
			return <pre>{code}</pre>
		} else {
			return <code>{code}</code>
		}
	}
}
