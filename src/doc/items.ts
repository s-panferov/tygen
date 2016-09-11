import { Comment } from './ast/comment'
import { Ref } from './index'

export enum ItemType {
	Interface = 'Interface' as any,
	UnionType = 'UnionType' as any,
	IntersectionType = 'IntersectionType' as any,
	TypeLiteral = 'TypeLiteral' as any,
	PropertySignature = 'PropertySignature' as any,
	PropertyDeclaration = 'PropertyDeclaration' as any,
	TypeParameter = 'TypeParameter' as any,
	HeritageClause = 'HeritageClause' as any,
	ExpressionWithTypeArguments = 'ExpressionWithTypeArguments' as any,
	LeftHandSideExpression = 'LeftHandSideExpression' as any,
	IndexSignature = 'IndexSignature' as any,
	CallSignature = 'CallSignature' as any,
	Parameter = 'Parameter' as any,
	Signature = 'Signature' as any,
	CoreTypeReference = 'CoreTypeReference' as any, // synthetic
	TypeReference = 'TypeReference' as any,
	Method = 'Method' as any, // top level
	MethodSignature = 'MethodSignature' as any,
	MethodDeclaration = 'MethodDeclaration' as any,
	FunctionType = 'FunctionType' as any,
	Class = 'Class' as any,
	ConstructorDeclaration = 'ConstructorDeclaration' as any,
	GetAccessorDeclaration = 'GetAccessorDeclaration' as any,
	SetAccessorDeclaration = 'SetAccessorDeclaration' as any,
	EnumDeclaration = 'EnumDeclaration' as any,
	EnumMember = 'EnumMember' as any,
	TypeAlias = 'TypeAlias' as any,
	VariableDeclaration = 'VariableDeclaration' as any,
	StringLiteralType = 'StringLiteralType' as any,
	ConstructorType = 'ConstructorType' as any,
	ArrayType = 'ArrayType' as any,
	TupleType = 'TupleType' as any,
	ParenthesizedType = 'ParenthesizedType' as any,
	TypePredicate = 'TypePredicate' as any,
	Function = 'Function' as any, // top level
	FunctionDeclaration = 'FunctionDeclaration' as any,
	AccessorReflection = 'AccessorReflection' as any,
	TypeQuery = 'TypeQuery' as any,
}

export interface Item {
	selfRef?: Ref
	name?: string
	comment?: Comment
	itemType?: ItemType
}
