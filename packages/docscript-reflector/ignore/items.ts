import { Comment } from './ast/comment'
import { Ref } from './index'

export enum ItemType {
	Interface = 'Interface',
	UnionType = 'UnionType',
	IntersectionType = 'IntersectionType',
	TypeLiteral = 'TypeLiteral',
	PropertySignature = 'PropertySignature',
	PropertyDeclaration = 'PropertyDeclaration',
	TypeParameter = 'TypeParameter',
	HeritageClause = 'HeritageClause',
	ExpressionWithTypeArguments = 'ExpressionWithTypeArguments',
	LeftHandSideExpression = 'LeftHandSideExpression',
	IndexSignature = 'IndexSignature',
	CallSignature = 'CallSignature',
	Parameter = 'Parameter',
	Signature = 'Signature',
	CoreTypeReference = 'CoreTypeReference', // synthetic
	TypeReference = 'TypeReference',
	Method = 'Method', // top level
	MethodSignature = 'MethodSignature',
	MethodDeclaration = 'MethodDeclaration',
	FunctionType = 'FunctionType',
	Class = 'Class',
	ConstructorDeclaration = 'ConstructorDeclaration',
	GetAccessorDeclaration = 'GetAccessorDeclaration',
	SetAccessorDeclaration = 'SetAccessorDeclaration',
	EnumDeclaration = 'EnumDeclaration',
	EnumMember = 'EnumMember',
	TypeAlias = 'TypeAlias',
	VariableDeclaration = 'VariableDeclaration',
	StringLiteralType = 'StringLiteralType',
	ConstructorType = 'ConstructorType',
	ArrayType = 'ArrayType',
	TupleType = 'TupleType',
	ParenthesizedType = 'ParenthesizedType',
	TypePredicate = 'TypePredicate',
	Function = 'Function', // top level
	FunctionDeclaration = 'FunctionDeclaration',
	AccessorReflection = 'AccessorReflection',
	TypeQuery = 'TypeQuery'
}

export interface Item {
	selfRef?: Ref
	name?: string
	comment?: Comment
	itemType?: ItemType
}
