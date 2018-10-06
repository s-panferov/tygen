import * as React from 'react'

import { PrettyCode } from './prettier'
import { Reflection, ReflectionKind } from '@tygen/reflector'
import { EnumPre } from './enum'
import { FunctionPre } from './function'
import { MethodPre } from './method'
import { PropertyPre } from './property'
import { TypeAliasPre } from './type-alias'
import { TypePre } from './type'
import { VariablePre } from '../variable'
import { ParameterPre } from './variable'

export class ReflectionPre extends PrettyCode<{ reflection: Reflection }> {
	render() {
		const { reflection } = this.props
		switch (reflection.kind) {
			case ReflectionKind.Enum:
				return <EnumPre reflection={reflection} />
			case ReflectionKind.Function:
				return <FunctionPre reflection={reflection} />
			case ReflectionKind.Method:
				return <MethodPre reflection={reflection} />
			case ReflectionKind.Property:
				return <PropertyPre reflection={reflection} />
			case ReflectionKind.TypeAlias:
				return <TypeAliasPre reflection={reflection} />
			case ReflectionKind.Parameter:
				return <ParameterPre reflection={reflection} />
			case ReflectionKind.Variable:
				return <VariablePre reflection={reflection} />
			case ReflectionKind.Type:
				return <TypePre reflection={reflection} />
			default:
				throw new Error(`Reflection is not supported ${reflection.kind}`)
		}
	}
}
