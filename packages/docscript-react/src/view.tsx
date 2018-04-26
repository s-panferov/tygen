import { BaseReflection } from '@docscript/reflector/src/reflection'
import React from 'react'

export interface ReflectionViewProps<R extends BaseReflection> {
	reflection: R
}

export class ReflectionView<R extends BaseReflection> extends React.Component<
	ReflectionViewProps<R>
> {}
