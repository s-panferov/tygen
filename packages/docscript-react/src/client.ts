import * as ReactDOM from 'react-dom'

import { renderReflection } from './render'

const url = window.location.pathname

fetch(`${url}/index.json`)
	.then(res => res.json())
	.then(refl => {
		ReactDOM.render(renderReflection(refl), document.querySelector('#react-app'))
	})
