import ts, { ModuleReference, TypeReference } from 'typescript'

import { Generator } from './generator'
import { Module } from './module'
import { Reflection, HasId, createLink } from './reflection/reflection'
import { ReflectionWithExports } from './reflection/reflection'
import { WriteStream } from 'fs'
import { Writer } from './writer'
import { TypeReflection } from './reflection/type/type'

export class Context {
	generator: Generator
	program: ts.Program
	checker: ts.TypeChecker

	visitedReflections = new Set<ts.Symbol>()

	reflectionById = new Map<String, Reflection>()

	reflectionBySymbol = new Map<ts.Symbol, Reflection>()
	symbolByReflection = new Map<Reflection, ts.Symbol>()

	reflectionByType = new Map<ts.Type, TypeReflection>()
	typeByReflection = new Map<TypeReflection, ts.Type>()

	constructor(generator: Generator) {
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

		if (reflection.id) {
			if (this.reflectionById.has(reflection.id)) {
				let conflict = this.symbolByReflection.get(this.reflectionById.get(reflection.id)!)!
				if (!areSymbolsEqual(symbol, conflict)) {
					console.error(`Duplicate ID for symbol: ${reflection.id}`)
					return
				}
			}
			this.reflectionById.set(reflection.id, reflection)
		}
	}

	registerRelatedModules() {
		this.symbolByReflection.forEach((symbol, reflection) => {
			if (symbol.declarations) {
				// Push a link to our interface to all modules that declare it

				symbol.declarations.forEach(decl => {
					let sourceFile = decl.getSourceFile()
					let module = this.generator.getModule(sourceFile.fileName)!
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

	write(outDir?: string) {
		const writer = new Writer(this, outDir)
		writer.write()
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
