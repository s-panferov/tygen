import React from 'react'

export class Join extends React.Component<{
	joinWith: (i: number, prev: React.ReactNode) => React.ReactNode
}> {
	render() {
		const { children, joinWith } = this.props
		const array = React.Children.toArray(children)
		const result = [] as React.ReactNode[]

		array.forEach((value, i) => {
			result.push(value)
			if (i < array.length - 1) {
				result.push(joinWith(i, value))
			}
		})

		return result
	}
}
