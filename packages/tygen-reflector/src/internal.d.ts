import * as ts from 'typescript'

declare module 'typescript' {
	interface TypeChecker {
		getMergedSymbol(symbol: ts.Symbol): ts.Symbol
	}
}
