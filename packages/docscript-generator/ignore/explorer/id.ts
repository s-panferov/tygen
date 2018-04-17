export class IdGenerator {
	ids: WeakMap<any, string>
	currentId: number

	constructor() {
		this.currentId = 1
		this.ids = new WeakMap()
	}

	id(object: any): string {
		if (!this.ids.has(object)) {
			this.ids.set(object, `explorer-${(this.currentId++).toString()}`)
			// this.ids.set(object, uuid.v1())
		}

		return this.ids.get(object)
	}
}

let instance = new IdGenerator()
export default instance
