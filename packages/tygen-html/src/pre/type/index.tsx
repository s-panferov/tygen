import * as React from 'react'

import { TypeReflection, TypeKind } from '@tygen/reflector/src/reflection/_type/reflection'
import { ReflectionKind } from '@tygen/reflector/src/reflection'
import { RefLink } from '../../ref-link'
import { css, cx } from 'linaria'
import { IntersectionTypePre } from './intersection'
import { TypeReferencePre } from './type-reference'
import { TypeParameterPre } from './type-parameter'
import { TuplePre } from './tuple'
import { ObjectView } from './object'
import { MappedTypePre } from './mapped'
import { IndexedAccessPre } from './indexed'
import { ConditionalTypePre } from './conditional'
import { IndexTypePre } from './index-type'
import { ThisView } from './this'
import { NotIncluded } from '../../not-included'
import { PrettyCode } from '../prettier'

export class TypePre extends PrettyCode<{ reflection: TypeReflection }> {
	render() {
		this.registerKeyword('any', /any/, <PrimitiveType>any</PrimitiveType>)
		this.registerKeyword('boolean', /boolean/, <PrimitiveType>boolean</PrimitiveType>)
		this.registerKeyword('never', /never/, <PrimitiveType>never</PrimitiveType>)
		this.registerKeyword('null', /null/, <PrimitiveType>null</PrimitiveType>)
		this.registerKeyword('number', /number/, <PrimitiveType>number</PrimitiveType>)
		this.registerKeyword('string', /string/, <PrimitiveType>string</PrimitiveType>)
		this.registerKeyword('void', /void/, <PrimitiveType>void</PrimitiveType>)
		this.registerKeyword('object', /object/, <PrimitiveType>object</PrimitiveType>)
		this.registerKeyword('undefined', /undefined/, <PrimitiveType>undefined</PrimitiveType>)

		const { reflection } = this.props

		switch (reflection.kind) {
			case ReflectionKind.Link:
				return <RefLink reflection={reflection} />
			case ReflectionKind.NotIncluded:
				return <NotIncluded reflection={reflection} />
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
						return <ThisView reflection={reflection} />
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
