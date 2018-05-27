import React from 'react'

export class Application extends React.Component<any> {
	render() {
		return (
			<html>
				<head />
				<body>{this.props.children}</body>
			</html>
		)
	}
}
