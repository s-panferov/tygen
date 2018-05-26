import { BaseReflection } from '@docscript/reflector/src/reflection'
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
	nav?: boolean
	compact?: boolean
	path: string
	static?: boolean
}

export const ViewContext = React.createContext<ViewSettings>()

export function withContext<P extends { settings?: ViewSettings }>(
	Class: React.ComponentClass<P>
): any {
	return (props: P) => {
		return (
			<ViewContext.Consumer>
				{settings => {
					return <Class {...props} settings={settings} />
				}}
			</ViewContext.Consumer>
		)
	}
}
