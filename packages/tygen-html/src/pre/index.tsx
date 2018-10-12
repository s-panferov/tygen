import * as React from 'react'
import { css, cx } from 'linaria'

import { PrettyCode } from './prettier'
import { Reflection, ReflectionKind } from '@tygen/reflector'
import { EnumPre } from './enum'
import { FunctionPre } from './function'
import { MethodPre } from './method'
import { PropertyPre } from './property'
import { TypeAliasPre } from './type-alias'
import { VariablePre, ParameterPre } from './variable'

import { RefLinkPre } from '../ref-link'
import { IntersectionTypePre } from './type/intersection'
import { TypeReferencePre } from './type/type-reference'
import { TypeParameterPre } from './type/type-parameter'
import { TuplePre } from './type/tuple'
import { ObjectView } from './type/object'
import { MappedTypePre } from './type/mapped'
import { IndexedAccessPre } from './type/indexed'
import { ConditionalTypePre } from './type/conditional'
import { IndexTypePre } from './type/index-type'
import { ThisPre } from './type/this'
import { NotIncludedPre } from './not-included'

export class ReflectionPre extends PrettyCode<{ reflection: Reflection }> {
	render() {
		this.keyword('any', /any/, <PrimitiveType>any</PrimitiveType>)
		this.keyword('boolean', /boolean/, <PrimitiveType>boolean</PrimitiveType>)
		this.keyword('never', /never/, <PrimitiveType>never</PrimitiveType>)
		this.keyword('null', /null/, <PrimitiveType>null</PrimitiveType>)
		this.keyword('number', /number/, <PrimitiveType>number</PrimitiveType>)
		this.keyword('string', /string/, <PrimitiveType>string</PrimitiveType>)
		this.keyword('void', /void/, <PrimitiveType>void</PrimitiveType>)
		this.keyword('object', /object/, <PrimitiveType>object</PrimitiveType>)
		this.keyword('undefined', /undefined/, <PrimitiveType>undefined</PrimitiveType>)

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
			case ReflectionKind.Link:
				return <RefLinkPre reflection={reflection} />
			case ReflectionKind.NotIncluded:
				return <NotIncludedPre reflection={reflection} />
			case ReflectionKind.AnyType:
				return 'any'
			case ReflectionKind.BooleanType:
				return 'boolean'
			case ReflectionKind.NeverType:
				return 'never'
			case ReflectionKind.NullType:
				return 'null'
			case ReflectionKind.NumberType:
				return 'number'
			case ReflectionKind.StringType:
				return 'string'
			case ReflectionKind.VoidType:
				return 'void'
			case ReflectionKind.ObjectType:
				return 'object'
			case ReflectionKind.UndefinedType:
				return 'undefined'
			case ReflectionKind.ESSymbolType:
				return 'symbol'
			case ReflectionKind.LiteralType:
				return JSON.stringify(reflection.value)
			case ReflectionKind.IntersectionType:
			case ReflectionKind.UnionType:
				return <IntersectionTypePre reflection={reflection} />
			case ReflectionKind.TypeReference:
				return <TypeReferencePre reflection={reflection} />
			case ReflectionKind.TypeParameter:
				return <TypeParameterPre reflection={reflection} />
			case ReflectionKind.TupleType:
				return <TuplePre reflection={reflection} />
			case ReflectionKind.MappedType:
				return <MappedTypePre reflection={reflection} />
			case ReflectionKind.ObjectLiteralType:
				return <ObjectView reflection={reflection} />
			case ReflectionKind.IndexedAccessType:
				return <IndexedAccessPre reflection={reflection} />
			case ReflectionKind.ConditionalType:
				return <ConditionalTypePre reflection={reflection} />
			case ReflectionKind.IndexType:
				return <IndexTypePre reflection={reflection} />
			case ReflectionKind.ThisType:
				return <ThisPre reflection={reflection} />
			default:
				throw new Error(`Not suppoted reflection: ${reflection.kind}`)
		}
	}
}

const PrimitiveTypeStyle = css`
	color: #10ac84;
`

export const PrimitiveType = (props: React.HTMLAttributes<any>) => (
	<span className={cx(PrimitiveTypeStyle, props.className)}>{props.children}</span>
)
