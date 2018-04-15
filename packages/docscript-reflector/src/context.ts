import ts, { ModuleReference } from 'typescript'

import { Generator } from './generator'
import { Module } from './module'
import { Reflection, HasId } from './reflection/reflection'
import { ReflectionWithExports } from './reflection/reflection'

export class Context {
	generator: Generator
	program: ts.Program
	checker: ts.TypeChecker

	module!: ReflectionWithExports
	visited = new Set<ts.Symbol>()

	reflectionById = new Map<String, Reflection>()
	reflectionBySymbol = new Map<ts.Symbol, Reflection>()

	constructor(generator: Generator) {
		this.generator = generator
		this.program = generator.program
		this.checker = generator.program.getTypeChecker()
	}

	withModule() {
		module
	}

	register(symbol: ts.Symbol, reflection: Reflection) {
		this.reflectionBySymbol.set(symbol, reflection)

		if (reflection.id) {
			if (this.reflectionById.has(reflection.id)) {
				debugger
				throw new Error(`Duplicate ID for symbol: ${reflection.id}`)
			}
			this.reflectionById.set(reflection.id, reflection)
		}
	}
}
