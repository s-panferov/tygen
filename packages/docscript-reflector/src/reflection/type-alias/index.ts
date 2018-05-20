import { ReflectionKind } from '../reflection'
import ts from 'typescript'
import { Context } from '../../context'
import { symbolId } from '../identifier'
import { visitType } from '../_type'
import { TypeAliasReflection } from './reflection'
import { visitTypeParameter } from '../type-parameter'
// import { visitTypeParameter } from '../type-parameter'

export function visitTypeAlias(symbol: ts.Symbol, ctx: Context): TypeAliasReflection {
	let typeAliasRef: TypeAliasReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeAlias,
		name: symbol.name,
		type: undefined as any
	}

	if (symbol.declarations) {
		const decl = symbol.declarations.find(decl => ts.isTypeAliasDeclaration(decl)) as
			| ts.TypeAliasDeclaration
			| undefined

		if (decl) {
			if (decl.typeParameters) {
				typeAliasRef.typeParameters = []
				decl.typeParameters.forEach(tyNode => {
					let tyParam = ctx.checker.getTypeAtLocation(tyNode)
					if (tyParam) {
						typeAliasRef.typeParameters!.push(visitTypeParameter(tyParam, ctx))
					}
				})
			}
		}
	}

	ctx.registerSymbol(symbol, typeAliasRef)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol)

	// TypeScript has weird TypeAlias resolution logic, aliasSymbol will point to
	// itself if type is not another type alias
	typeAliasRef.type = visitType(type, ctx, { skipAlias: type.aliasSymbol === symbol })

	return typeAliasRef
}
