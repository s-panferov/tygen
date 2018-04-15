let pako = require('pako/dist/pako_inflate.min.js')

export function inflateJson(res: Response): Promise<any> {
	return res.arrayBuffer().then(buf => {
		let result = ''
		try {
			result = JSON.parse(pako.inflate(buf, { to: 'string' }))
		} catch (err) {
			console.log(err)
		}

		return result
	})
}
