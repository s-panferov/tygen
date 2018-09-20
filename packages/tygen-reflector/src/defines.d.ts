declare module 'node-uuid' {
	export function v1(): string
	export function v4(): string
}

declare module 'roarr' {
	interface LoggingFunction {
		(context: object, message: string, ...params: any[]): void
		(message: string, ...params: any[]): void
	}

	export class Logger {
		trace: LoggingFunction
		debug: LoggingFunction
		info: LoggingFunction
		warn: LoggingFunction
		error: LoggingFunction
		fatal: LoggingFunction
	}

	const def: Logger
	export default def
}
