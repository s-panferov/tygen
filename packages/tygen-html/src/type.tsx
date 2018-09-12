import * as React from 'react'

import { BaseView } from './view'
import { TypeReflection, TypeKind } from '@tygen/reflector/src/reflection/_type/reflection'
import { ReflectionKind } from '@tygen/reflector/src/reflection'
import { RefLink } from './ref-link'
import { css, names } from 'linaria'
import { IntersectionTypeView } from './type/intersection'
import { TypeReferenceView } from './type/type-reference'
import { TypeParameterView } from './type/type-parameter'
import { TupleView } from './type/tuple'
import { ObjectView } from './type/object'
import { MappedView } from './type/mapped'
import { IndexedAccessView } from './type/indexed'
import { ConditionalView } from './type/conditional'
import { IndexTypeView } from './type/index-type'
import { ESSymbolView } from './type/symbol'
import { ThisView } from './type/this'
import { NotIncluded } from './not-included'

export class TypeView extends BaseView<TypeReflection> {
	render() {
		const { reflection } = this.props

		switch (reflection.kind) {
			case ReflectionKind.Link:
				return <RefLink reflection={reflection} />
			case ReflectionKind.NotIncluded:
				return <NotIncluded reflection={reflection} />
			case ReflectionKind.Type:
				switch (reflection.typeKind) {
					case TypeKind.Any:
						return <PrimitiveType>any</PrimitiveType>
					case TypeKind.Boolean:
						return <PrimitiveType>boolean</PrimitiveType>
					case TypeKind.Never:
						return <PrimitiveType>never</PrimitiveType>
					case TypeKind.Null:
						return <PrimitiveType>null</PrimitiveType>
					case TypeKind.Number:
						return <PrimitiveType>number</PrimitiveType>
					case TypeKind.String:
						return <PrimitiveType>string</PrimitiveType>
					case TypeKind.Void:
						return <PrimitiveType>void</PrimitiveType>
					case TypeKind.Object:
						return <PrimitiveType>object</PrimitiveType>
					case TypeKind.Undefined:
						return <PrimitiveType>undefined</PrimitiveType>
					case TypeKind.Literal:
						return <PrimitiveType>{JSON.stringify(reflection.value)}</PrimitiveType>
					case TypeKind.Intersection:
					case TypeKind.Union:
						return <IntersectionTypeView reflection={reflection} />
					case TypeKind.TypeReference:
						return <TypeReferenceView reflection={reflection} />
					case TypeKind.TypeParameter:
						return <TypeParameterView reflection={reflection} />
					case TypeKind.Tuple:
						return <TupleView reflection={reflection} />
					case TypeKind.Mapped:
						return <MappedView reflection={reflection} />
					case TypeKind.ObjectLiteral:
						return <ObjectView reflection={reflection} />
					case TypeKind.IndexedAccess:
						return <IndexedAccessView reflection={reflection} />
					case TypeKind.Conditional:
						return <ConditionalView reflection={reflection} />
					case TypeKind.Index:
						return <IndexTypeView reflection={reflection} />
					case TypeKind.ESSymbol:
						return <ESSymbolView reflection={reflection} />
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
	<span className={names(PrimitiveTypeCSS, props.className)}>{props.children}</span>
)
