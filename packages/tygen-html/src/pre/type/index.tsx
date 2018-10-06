import * as React from 'react'
import { css, cx } from 'linaria'

import { TypeReflection, TypeKind, ReflectionKind } from '@tygen/reflector'
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
			case ReflectionKind.Type:
				switch (reflection.typeKind) {
					case TypeKind.Any:
						return 'any'
					case TypeKind.Boolean:
						return 'boolean'
					case TypeKind.Never:
						return 'never'
					case TypeKind.Null:
						return 'null'
					case TypeKind.Number:
						return 'number'
					case TypeKind.String:
						return 'string'
					case TypeKind.Void:
						return 'void'
					case TypeKind.Object:
						return 'object'
					case TypeKind.Undefined:
						return 'undefined'
					case TypeKind.ESSymbol:
						return 'symbol'
					case TypeKind.Literal:
						return JSON.stringify(reflection.value)
					case TypeKind.Intersection:
					case TypeKind.Union:
						return <IntersectionTypePre reflection={reflection} />
					case TypeKind.TypeReference:
						return <TypeReferencePre reflection={reflection} />
					case TypeKind.TypeParameter:
						return <TypeParameterPre reflection={reflection} />
					case TypeKind.Tuple:
						return <TuplePre reflection={reflection} />
					case TypeKind.Mapped:
						return <MappedTypePre reflection={reflection} />
					case TypeKind.ObjectLiteral:
						return <ObjectView reflection={reflection} />
					case TypeKind.IndexedAccess:
						return <IndexedAccessPre reflection={reflection} />
					case TypeKind.Conditional:
						return <ConditionalTypePre reflection={reflection} />
					case TypeKind.Index:
						return <IndexTypePre reflection={reflection} />
					case TypeKind.This:
						return <ThisPre reflection={reflection} />
					default:
						return 'unsupported ' + reflection.typeKind
				}
		}
	}
}

const PrimitiveTypeCSS = css`
	color: #10ac84;
`

export const PrimitiveType = (props: React.HTMLAttributes<any>) => (
	<span className={cx(PrimitiveTypeCSS, props.className)}>{props.children}</span>
)
