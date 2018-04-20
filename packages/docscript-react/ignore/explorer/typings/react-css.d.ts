declare module 'reactcss' {
	import * as React from 'react'

	interface ReactCSSElements {
		[key: string]: React.CSSProperties
	}

	interface ReactCSSRef<T extends ReactCSSElements> {
		default: T
		[key: string]: React.CSSProperties
	}

	export default function reactCSS<T extends ReactCSSElements>(
		ref: ReactCSSRef<T>,
		props?: {},
		state?: {}
	): T
}
