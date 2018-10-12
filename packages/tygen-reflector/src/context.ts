import ts from 'typescript'

import { Generator } from './generator'
import { Reflection, createLink } from './reflection/reflection'
import { TypeReflection } from './reflection/_type/reflection'
import { stringifyId } from './reflection/identifier'
import { Options } from './options'

export class Context {
	generator: Generator
	program: ts.Program
	checker: ts.TypeChecker
	options: Options

	visitedReflections = new Set<ts.Symbol>()

	reflectionById = new Map<string, Reflection>()

	reflectionBySymbol = new Map<ts.Symbol, Reflection>()
	symbolByReflection = new Map<Reflection, ts.Symbol>()

	reflectionByType = new Map<ts.Type, TypeReflection>()
	typeByReflection = new Map<TypeReflection, ts.Type>()

	constructor(generator: Generator) {
		this.options = generator.options
		this.generator = generator
		this.program = generator.program
		this.checker = generator.program.getTypeChecker()
	}

	registerType(type: ts.Type, reflection: TypeReflection) {
		this.reflectionByType.set(type, reflection)
		this.typeByReflection.set(reflection, type)
	}

	registerSymbol(symbol: ts.Symbol, reflection: Reflection) {
		this.reflectionBySymbol.set(symbol, reflection)
		this.symbolByReflection.set(reflection, symbol)
		this.registerReflectionWithoutSymbol(reflection, symbol)
	}

	registerReflectionWithoutSymbol(reflection: Reflection, symbol?: ts.Symbol) {
		if (reflection.id) {
			const stringId = stringifyId(reflection.id)
			const current = this.reflectionById.get(stringId)
			if (current) {
				let conflict = this.symbolByReflection.get(current)!
				if (!symbol || !areSymbolsEqual(symbol, conflict)) {
					debugger
					console.error(`Duplicate ID for symbol`, reflection.id)
					return
				}
			}
			this.reflectionById.set(stringId, reflection)
		}
	}

	registerRelatedModules() {
		this.symbolByReflection.forEach((symbol, reflection) => {
			if (symbol.declarations) {
				// Push a link to our interface to all modules that declare it
				symbol.declarations.forEach(decl => {
					let sourceFile = decl.getSourceFile()
					let module = this.generator.getFile(sourceFile.fileName)!
					if (module.reflection) {
						if (!module.reflection.exports) {
							module.reflection.exports = []
						}
						module.reflection.exports.push(createLink(reflection))
					}
				})
			}
		})
	}
}

function areSymbolsEqual(a: ts.Symbol, b: ts.Symbol) {
	if (a === b) {
		return true
	}

	if (a.declarations && b.declarations && a.declarations[0] === b.declarations[0]) {
		return true
	}

	return false
}
