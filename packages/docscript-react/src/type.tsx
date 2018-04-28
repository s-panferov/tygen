import * as React from 'react'

import { BaseView } from './view'
import { TypeReflection, TypeKind } from '@docscript/reflector/src/reflection/_type/reflection'
import { ReflectionKind } from '@docscript/reflector/src/reflection'
import { RefLink } from './ref-link'
import styled from 'styled-components'
import { IntersectionTypeView } from './type/intersection'

export class TypeView extends BaseView<TypeReflection> {
	render() {
		const { reflection } = this.props

		switch (reflection.kind) {
			case ReflectionKind.Link:
				return <RefLink reflection={reflection} />
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
					default:
						return 'unsupported ' + reflection.typeKind
				}
		}
	}
}

const PrimitiveType = styled.span`
	color: #10ac84;
`
