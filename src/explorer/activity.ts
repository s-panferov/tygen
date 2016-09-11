export default class ActivityManager {
	watching: number
	callbacks: ((active: boolean) => void)[] = []

	constructor() {
		this.watching = 0
		this.callbacks = []
		this.afterResolve = this.afterResolve.bind(this)
	}

	isActive() {
		return !!this.watching
	}

	registerCallback(cb) {
		this.callbacks.push(cb)
	}

	unregisterCallback(cb) {
		let index = this.callbacks.indexOf(cb)
		this.callbacks.splice(index, 1)
	}

	inc() {
		if (!this.watching) {
			this.watching++
			this.callbacks.forEach(cb => cb(true))
		} else {
			this.watching++
		}
	}

	dec() {
		this.watching--
		if (!this.watching) {
			this.callbacks.forEach(cb => cb(false))
		}
	}

	watch(promise: Promise<any>) {
		this.inc()
		promise
			.then(this.afterResolve)
			.catch(this.afterResolve)
	}

	afterResolve() {
		this.dec()
	}
}
