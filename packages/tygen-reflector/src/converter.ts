import fs from 'fs'
import { Argv } from 'yargs'

import { Reflection } from './reflection/reflection'
import { ReflectionWalker } from './walker'

export interface File {
	content: string
	name: string
}

export interface ConverterFactory {
	args?: (yargs: Argv) => Argv
	(argv: any): Converter
}

export interface Converter {
	visitReflection(
		reflection: Reflection,
		fileName: string,
		walker: ReflectionWalker
	): File[] | undefined

	emitRuntime?(outDir: string, extra: { fs: typeof fs; main: string }): File[] | undefined
}
