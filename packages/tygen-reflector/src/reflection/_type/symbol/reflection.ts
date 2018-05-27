import { TypeReflectionBase, TypeKind } from '../reflection'

export interface ESSymbolReflection extends TypeReflectionBase {
	typeKind: TypeKind.ESSymbol
}
