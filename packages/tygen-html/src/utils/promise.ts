import {
	createAtom,
	IAtom,
	autorun,
	observable,
	reaction,
	IAutorunOptions,
	IReactionOptions
} from 'mobx'

import axios, { CancelToken } from 'axios'
import { Payload, Cancel, cancellify } from './payload'

export type Autorun<T> = (props: ReactOpts) => Promise<T> | Payload<T> | undefined
export type Reaction<T, E> = (
	expression: E,
	props: ReactOpts
) => Promise<T> | Payload<T> | undefined

export interface ReactOpts {
	refreshToken: number
	cancelToken: CancelToken
}

export type MobxPromiseOpts<T, E = {}> = MobxPromiseAutorunOpts<T> | MobxPromiseReactionOpts<T, E>

export interface MobxPromiseAutorunOpts<T> {
	autorun: Autorun<T>
	keep?: boolean
	options?: IAutorunOptions
}

function isAutorun<T, E>(opts: MobxPromiseOpts<T, E>): opts is MobxPromiseAutorunOpts<T> {
	return !!(opts as any).autorun
}

export interface MobxPromiseReactionOpts<T, E> {
	expression: () => E
	effect: Reaction<T, E>
	keep?: boolean
	options?: IReactionOptions
}

let globalSpy = false
export function spyForPayloads<T>(cb: () => T) {
	const globalSpyWasTriggeredBefore = globalSpy
	globalSpy = true
	const res = cb()
	if (!globalSpyWasTriggeredBefore) {
		globalSpy = false
	}

	return res
}

/**
 * Dummy function to avoid TypeScript complaining on unused
 * expressions
 */
export function reference<T>(x: T): T {
	return x
}

export class MobxPromiseBuilder<O, E, Opts> {
	_view!: Autorun<O>
	_exp!: () => E
	_eff!: Reaction<any, any>
	_opts!: Opts

	autorun<T>(view: Autorun<T>): MobxPromiseBuilder<T, E, IAutorunOptions> {
		this._view = view as any
		return this as any
	}

	expression<T>(exp: () => T): MobxPromiseBuilder<O, T, IReactionOptions> {
		this._exp = exp as any
		return this as any
	}

	effect<T>(eff: Reaction<T, E>): MobxPromiseBuilder<T, E, IReactionOptions> {
		this._eff = eff as any
		return this as any
	}

	options(o: Opts): this {
		this._opts = o
		return this as any
	}

	build() {
		if (this._view) {
			return new MobxPromise<O>({
				autorun: this._view,
				options: this._opts
			})
		} else {
			return new MobxPromise<O>({
				expression: this._exp,
				effect: this._eff,
				options: this._opts
			})
		}
	}
}

export function mobxPromise() {
	return new MobxPromiseBuilder()
}

export class MobxPromise<T> {
	private mainAtom: IAtom
	private spyAtom: IAtom
	private _payload: Payload<T> = new Payload.Nothing()
	private opts: MobxPromiseOpts<T>

	private cancel: Cancel | undefined
	private activeReaction?: Cancel

	private scheduledUpdate = false
	private observed = false

	@observable.ref
	private reloadToken = 0

	get payload(): Payload<T> {
		if (globalSpy) {
			this.spyAtom.reportObserved()
		} else {
			this.mainAtom.reportObserved()
		}
		return this._payload
	}

	get loading(): boolean {
		return this._payload.isLoading()
	}

	reload() {
		this.reloadToken++
	}

	constructor(opts: MobxPromiseOpts<T>) {
		this.mainAtom = createAtom(
			'PromiseMain',
			() => this.becomeObserved(),
			() => this.becomeUnobserved()
		)
		this.spyAtom = createAtom('PromiseSpy', () => {}, () => {})
		this.opts = opts
	}

	private becomeObserved() {
		this.observed = true

		if (this.activeReaction) {
			if (this.scheduledUpdate) {
				this.scheduledUpdate = false
				this.dispose()
				this._payload = new Payload.Loading()
				this.becomeObserved()
			}
		} else {
			if (isAutorun(this.opts)) {
				this.activeReaction = autorun(() => {
					this.tick()
				}, this.opts.options)
			} else {
				const opts = this.opts
				this.activeReaction = reaction(
					() => {
						return opts.expression()
					},
					eff => this.tick(eff),
					this.opts.options
				)
			}
		}
	}

	private tick(eff?: any) {
		if (!this.observed) {
			this.scheduledUpdate = true
			return
		}

		reference(this.reloadToken)

		if (this.cancel) {
			this.cancel()
		}

		const { token, cancel } = axios.CancelToken.source()
		this.cancel = cancel

		const props = { cancelToken: token, refreshToken: this.reloadToken }
		const result = isAutorun(this.opts)
			? this.opts.autorun(props)
			: this.opts.effect(eff, props)

		if (!result) {
			this.update(new Payload.Nothing())
		} else {
			if (isPromise(result)) {
				let resolved = false
				setImmediate(() => {
					// Cannot update right now because it can trigger
					// forceUpdates in the middle of the render
					if (!resolved && !token.reason) {
						this.update(new Payload.Loading(cancel))
					}
				})

				cancellify(result, token)
					.then(value => {
						resolved = true
						this.update(new Payload.Value(value))
					})
					.catch(err => {
						resolved = true
						if (axios.isCancel(err)) {
							return
						}
						console.error(err)
						this.update(new Payload.Error(err))
					})
			} else {
				this.update(result)
			}
		}
	}

	private update(payload: Payload<T>) {
		this._payload = payload
		this.spyAtom.reportChanged()
		this.mainAtom.reportChanged()
	}

	private becomeUnobserved() {
		this.observed = false

		if (this.opts.keep === false) {
			this.dispose()
		}
	}

	private dispose() {
		if (this.activeReaction) {
			this.activeReaction()
			this.activeReaction = undefined
		}
		if (this.cancel) {
			this.cancel()
			this.cancel = undefined
		}
	}
}

function isPromise<T>(value: Promise<T> | Payload<T> | undefined): value is Promise<T> {
	return !!value && typeof (value as any).then === 'function'
}
