import axios, { CancelToken } from 'axios'

export type Cancel = (reason?: string, info?: any) => void
export type PayloadState = 'nothing' | 'value' | 'loading' | 'error'
export const PayloadState = {
	Nothing: 'nothing' as 'nothing',
	Value: 'value' as 'value',
	Loading: 'loading' as 'loading',
	Error: 'error' as 'error'
}

export abstract class PayloadBase<T> {
	abstract match<R>(matcher: PayloadMatcher<T, R>): R

	isReady(matcher?: Partial<PayloadMatcher<T, boolean>>): boolean {
		return this.match(
			Object.assign(
				{
					Value: () => true,
					Error: () => true,
					Nothing: () => false,
					Loading: () => false
				},
				matcher
			)
		)
	}
}

export class PayloadValue<T> extends PayloadBase<T> implements PayloadApi<T> {
	state = PayloadState.Value
	value: T
	meta: any

	constructor(entity: T, meta: any = {}) {
		super()
		this.value = entity
		this.meta = meta
	}

	isValue(this: Payload<T>): this is PayloadValue<T> {
		return true
	}
	isLoading(this: Payload<T>): this is PayloadLoading<T> {
		return false
	}
	isError(this: Payload<T>): this is PayloadError<T> {
		return false
	}
	isNothing(this: Payload<T>): this is PayloadNothing<T> {
		return false
	}

	match<R>(matcher: PayloadMatcher<T, R>): R {
		return matcher.Value(this.value)
	}

	andThen<U>(op: (a: T) => Payload<U>): Payload<U> {
		return op(this.value)
	}

	map<U>(op: (a: T) => U): Payload<U> {
		return new Payload.Value(op(this.value))
	}

	orElse(_: (a: Error) => Payload<T>): Payload<T> {
		return this
	}

	unwrapOr<R>(_or: R): T | R {
		return this.value
	}

	unwrapOrElse<R>(_: (e?: Error) => R): T | R {
		return this.value
	}
}

export class PayloadLoading<T> extends PayloadBase<T> implements PayloadApi<T> {
	__brand!: T
	state = PayloadState.Loading
	meta: any
	cancel = () => {}

	constructor(cancel?: Cancel, meta = {}) {
		super()
		if (cancel) {
			this.cancel = cancel
		}
		this.meta = meta
	}

	isValue(this: Payload<T>): this is PayloadValue<T> {
		return false
	}
	isLoading(this: Payload<T>): this is PayloadLoading<T> {
		return true
	}
	isError(this: Payload<T>): this is PayloadError<T> {
		return false
	}
	isNothing(this: Payload<T>): this is PayloadNothing<T> {
		return false
	}

	match<R>(matcher: PayloadMatcher<T, R>): R {
		return matcher.Loading(this.cancel)
	}

	andThen<U>(_op: (a: T) => Payload<U>): Payload<U> {
		return this as any
	}

	map<U>(_op: (a: T) => U): Payload<U> {
		return this as any
	}

	unwrapOr<R>(def: R): T | R {
		return def
	}

	unwrapOrElse<R>(def: (e?: Error) => R): T | R {
		return def()
	}
}

export class PayloadError<T> extends PayloadBase<T> implements PayloadApi<T> {
	__brand!: T
	state = PayloadState.Error
	meta: any
	error: Error

	constructor(error: Error, meta = {}) {
		super()
		this.error = error
		this.meta = meta
	}

	isValue(this: Payload<T>): this is PayloadValue<T> {
		return false
	}
	isLoading(this: Payload<T>): this is PayloadLoading<T> {
		return false
	}
	isError(this: Payload<T>): this is PayloadError<T> {
		return true
	}
	isNothing(this: Payload<T>): this is PayloadNothing<T> {
		return false
	}

	unwrapOr<R>(def: R): T | R {
		return def
	}

	unwrapOrElse<R>(def: (error?: Error) => R): T | R {
		return def(this.error)
	}

	map<U>(_op: (a: T) => U): Payload<U> {
		return this as any
	}

	andThen<U>(_op: (a: T) => Payload<U>): Payload<U> {
		return this as any
	}

	match<R>(matcher: PayloadMatcher<T, R>): R {
		return matcher.Error(this.error)
	}
}

export class PayloadNothing<T> extends PayloadBase<T> implements PayloadApi<T> {
	__brand!: T
	state = PayloadState.Nothing
	meta: any

	constructor(meta = {}) {
		super()
		this.meta = meta
	}

	isValue(this: Payload<T>): this is PayloadValue<T> {
		return false
	}
	isLoading(this: Payload<T>): this is PayloadLoading<T> {
		return false
	}
	isError(this: Payload<T>): this is PayloadError<T> {
		return false
	}
	isNothing(this: Payload<T>): this is PayloadNothing<T> {
		return true
	}

	unwrapOr<R>(def: R): T | R {
		return def
	}

	unwrapOrElse<R>(def: (error?: Error) => R): T | R {
		return def()
	}

	andThen<U>(_op: (a: T) => Payload<U>): Payload<U> {
		return this as any
	}

	map<U>(_op: (a: T) => U): Payload<U> {
		return this as any
	}

	match<R>(matcher: PayloadMatcher<T, R>): R {
		return matcher.Nothing()
	}
}

export interface PayloadApi<T> {
	state: PayloadState

	isValue(this: Payload<T>): this is PayloadValue<T>
	isLoading(this: Payload<T>): this is PayloadLoading<T>
	isError(this: Payload<T>): this is PayloadError<T>
	isNothing(this: Payload<T>): this is PayloadNothing<T>

	match<R>(matcher: PayloadMatcher<T, R>): R
	isReady(matcher?: Partial<PayloadMatcher<T, boolean>>): boolean
	andThen<U>(op: (a: T) => Payload<U>): Payload<U>
	map<U>(op: (a: T) => U): Payload<U>
	unwrapOr<R>(or: R): T | R
	unwrapOrElse<R>(or: (e?: Error) => R): T | R
}

export type Payload<T> = PayloadValue<T> | PayloadError<T> | PayloadLoading<T> | PayloadNothing<T>

export function all<T>(payloads: Payload<T>[]): Payload<T[]> {
	const array = [] as T[]

	for (const p of payloads) {
		if (p.isLoading() || p.isError() || p.isNothing()) {
			return (p as any) as Payload<T[]>
		}
		array.push(p.value)
	}

	return new Payload.Value(array)
}

export const Payload = {
	State: PayloadState,
	Value: PayloadValue,
	Loading: PayloadLoading,
	Error: PayloadError,
	Nothing: PayloadNothing,
	isError,
	isValue,
	isNothing,
	isLoading,
	fromPromise,
	all
}

export default Payload

export function isValue<T>(load: Payload<T>): load is PayloadValue<T> {
	return load.state === PayloadState.Value
}
export function isLoading<T>(load: Payload<T>): load is PayloadLoading<T> {
	return load.state === PayloadState.Loading
}
export function isError<T>(load: Payload<T>): load is PayloadError<T> {
	return load.state === PayloadState.Error
}
export function isNothing<T>(load: Payload<T>): load is PayloadNothing<T> {
	return load.state === PayloadState.Nothing
}

export interface PayloadMatcher<T, R> {
	Nothing: () => R
	Value: (entity: T) => R
	Loading: (cancel: Cancel) => R
	Error: (error: Error) => R
}

export function cancellify<T>(promise: Promise<T>, cancelToken: CancelToken): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		promise
			.then(value => {
				if (!cancelToken.reason) {
					resolve(value)
				}
			})
			.catch(err => {
				if (!cancelToken.reason) {
					reject(err)
				}
			})

		cancelToken.promise.then(reject)
	})
}

export function fromPromise<T>(opts: {
	promise: Promise<T>
	cancel?: Cancel
	cancellable?: boolean
	update: (p: Payload<T>) => void
}): Promise<T> {
	let { promise, cancel, cancellable, update } = opts

	if (cancellable && !cancel) {
		const { token: cancelToken, cancel: _cancel } = axios.CancelToken.source()
		cancel = _cancel
		promise = cancellify<T>(promise, cancelToken)
	}

	const nextPromise = promise
		.then(res => {
			update(new Payload.Value(res))
			return res
		})
		.catch(err => {
			if (!axios.isCancel(err)) {
				update(new Payload.Error<any>(err))
			}
			throw err
		})

	update(new Payload.Loading<any>(cancel, { promise: nextPromise }))
	return nextPromise
}
