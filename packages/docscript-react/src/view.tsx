import { Reflection } from '@docscript/reflector'
import React from 'react'

export interface ReflectionViewProps<R extends Reflection> {
	reflection: R
}

export class ReflectionView<R extends Reflection> extends React.Component<ReflectionViewProps<R>> {}
