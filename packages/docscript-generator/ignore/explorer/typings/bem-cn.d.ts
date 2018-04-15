declare module 'bem-cn' {
	interface BemMods {
		[mod: string]: string | boolean | any
	}

	type BemMix = string | string[] | { [cls: string]: boolean } | { toString(): string }

	interface Block {
		(elem: string, ...mods: BemMods[]): Block
		(...mods: BemMods[]): Block

		mix(classes: BemMix): Block
		toString(): string
	}

	interface BemCn {
		(name: string, ...mod: any[]): Block
		setup(conf: any): void
	}

	let bemCn: BemCn
	export = bemCn
}
