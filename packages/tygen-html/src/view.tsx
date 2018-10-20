import { BaseReflection } from '@tygen/reflector'
import React from 'react'
import { ReactConverterSettings } from './settings'

export interface ReflectionViewProps<R extends BaseReflection> {
	reflection: R
	settings?: ViewSettings
}

export abstract class BaseView<
	R extends BaseReflection,
	P extends object = {}
> extends React.Component<ReflectionViewProps<R> & P> {}

export interface ViewSettings extends ReactConverterSettings {
	path: string
	static?: boolean
}

export const ViewContext = React.createContext<ViewSettings>({} as any)

export interface WithContext<T, K extends string> {
	<P extends Record<K, T>>(component: React.ComponentClass<P>): React.SFC<
		Pick<P, Exclude<keyof P, K>>
	>
	<P extends Record<K, T>>(component: React.SFC<P>): React.SFC<Pick<P, Exclude<keyof P, K>>>
}

export function withContext<T, K extends string>(context: React.Context<T>, key: K) {
	const worker: WithContext<T, K> = (Component: any) => {
		return (props: any) => {
			return (
				<context.Consumer>
					{context => {
						return <Component {...props} {...{ [key]: context }} />
					}}
				</context.Consumer>
			)
		}
	}

	return worker
}

export const withSettings = withContext(ViewContext, 'settings')
