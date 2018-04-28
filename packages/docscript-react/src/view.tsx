import { BaseReflection } from '@docscript/reflector/src/reflection'
import React from 'react'

export interface ReflectionViewProps<R extends BaseReflection> {
	reflection: R
	nav?: boolean
}

export abstract class BaseView<
	R extends BaseReflection,
	P extends object = {}
> extends React.Component<ReflectionViewProps<R> & P> {}
