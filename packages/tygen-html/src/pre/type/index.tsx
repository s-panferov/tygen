import * as React from 'react'
import { css, cx } from 'linaria'

import { TypeReflection, ReflectionKind } from '@tygen/reflector'
import { RefLinkPre } from '../../ref-link'
import { IntersectionTypePre } from './intersection'
import { TypeReferencePre } from './type-reference'
import { TypeParameterPre } from './type-parameter'
import { TuplePre } from './tuple'
import { ObjectView } from './object'
import { MappedTypePre } from './mapped'
import { IndexedAccessPre } from './indexed'
import { ConditionalTypePre } from './conditional'
import { IndexTypePre } from './index-type'
import { ThisPre } from './this'
import { NotIncludedPre } from '../../not-included'
import { PrettyCode } from '../prettier'

export class TypePre extends PrettyCode<{ reflection: TypeReflection }> {
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
				return 'unsupported ' + reflection.kind
		}
	}
}

const PrimitiveTypeStyle = css`
	color: #10ac84;
`

export const PrimitiveType = (props: React.HTMLAttributes<any>) => (
	<span className={cx(PrimitiveTypeStyle, props.className)}>{props.children}</span>
)
