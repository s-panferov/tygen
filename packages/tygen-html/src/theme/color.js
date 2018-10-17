export function convertColorThemeToCSS(theme) {
	let style = ''

	theme.tokenColors.forEach(token => {
		const classSpecifier = token.scope.replace(/([ ,]|^)([a-z])/g, (_a, b, c) => {
			return b + '.' + c
		})

		let body = ''
		Object.keys(token.settings).forEach(key => {
			const value = token.settings[key]
			if (!value) {
				return
			}

			if (key === 'foreground') {
				body += `color: ${value};`
			} else if (key === 'background') {
				body += `background-color: ${value};`
			} else {
				body += `${key}: ${value};`
			}
		})

		style += `
			${classSpecifier} {${body}}
		`
	})

	return `
		background-color: ${theme.colors['editor.background']};
		color: ${theme.colors['editor.foreground']};

		${style}
	`
}

export const colorTheme = {
	$schema: 'vscode://schemas/color-theme',
	type: 'light',
	colors: {
		'editor.background': '#fafafa',
		'editor.foreground': '#383a42',
		'editor.lineHighlightBackground': '#f0f0f1',
		'editorCursor.foreground': '#526fff',
		'editorIndentGuide.background': '#cbd3ff'
	},
	tokenColors: [{
			name: 'Comment',
			scope: 'comment',
			settings: {
				foreground: '#a0a1a7'
			}
		},
		{
			name: 'Comment Markup Link',
			scope: 'comment markup.link',
			settings: {
				foreground: '#a0a1a7'
			}
		},
		{
			name: 'Entity Name Type',
			scope: 'entity.name.type',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Inherited class',
			scope: 'entity.other.inherited-class',
			settings: {
				fontStyle: '',
				foreground: '#50a14f'
			}
		},
		{
			name: 'Keyword',
			scope: 'keyword',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Keyword Control',
			scope: 'keyword.control',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Keyword Operator',
			scope: 'keyword.operator',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Keyword Other Special Method',
			scope: 'keyword.other.special-method',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Keyword Other Unit',
			scope: 'keyword.other.unit',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Storage',
			scope: 'storage',
			settings: {
				fontStyle: '',
				foreground: '#a626a4'
			}
		},
		{
			name: 'Storage type',
			scope: 'storage.type',
			settings: {
				fontStyle: '',
				foreground: '#a626a4'
			}
		},
		{
			name: 'Storage Modifier Package,storage Modifier Import',
			scope: 'storage.modifier.package,storage.modifier.import',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Constant',
			scope: 'constant',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Constant Variable',
			scope: 'constant.variable',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Constant Character Escape',
			scope: 'constant.character.escape',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Constant Numeric',
			scope: 'constant.numeric',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Constant Other Color',
			scope: 'constant.other.color',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Constant Other Symbol',
			scope: 'constant.other.symbol',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Variable',
			scope: 'variable',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Variable Interpolation',
			scope: 'variable.interpolation',
			settings: {
				foreground: '#ca1243'
			}
		},
		{
			name: 'Variable Parameter',
			scope: 'variable.parameter',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'String',
			scope: 'string',
			settings: {
				foreground: '#50a14f'
			}
		},
		{
			name: 'String Regexp',
			scope: 'string.regexp',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'String Regexp Source Ruby Embedded',
			scope: 'string.regexp source.ruby.embedded',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'String Other Link',
			scope: 'string.other.link',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Punctuation Definition Comment',
			scope: 'punctuation.definition.comment',
			settings: {
				foreground: '#a0a1a7'
			}
		},
		{
			name: 'Punctuation Definition Method Parameters,punctuation Definition Function Parameters,punctuation Definition Parameters,punctuation Definition Separator,punctuation Definition Seperator,punctuation Definition Array',
			scope: 'punctuation.definition.method-parameters,punctuation.definition.function-parameters,punctuation.definition.parameters,punctuation.definition.separator,punctuation.definition.seperator,punctuation.definition.array',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Punctuation Definition Heading,punctuation Definition Identity',
			scope: 'punctuation.definition.heading,punctuation.definition.identity',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Punctuation Definition Bold',
			scope: 'punctuation.definition.bold',
			settings: {
				foreground: '#c18401',
				'font-weight': 'bold'
			}
		},
		{
			name: 'Punctuation Definition Italic',
			scope: 'punctuation.definition.italic',
			settings: {
				foreground: '#a626a4',
				'font-style': 'italic'
			}
		},
		{
			name: 'Punctuation Section Embedded',
			scope: 'punctuation.section.embedded',
			settings: {
				foreground: '#ca1243'
			}
		},
		{
			name: 'Punctuation Section Method,punctuation Section Class,punctuation Section Inner Class',
			scope: 'punctuation.section.method,punctuation.section.class,punctuation.section.inner-class',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Support Class',
			scope: 'support.class',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Support Type',
			scope: 'support.type',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Support Function',
			scope: 'support.function',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Support Function Any Method',
			scope: 'support.function.any-method',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Entity Name Function',
			scope: 'entity.name.function',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Entity Name Class,entity Name Type Class',
			scope: 'entity.name.class,entity.name.type.class',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Entity Name Section',
			scope: 'entity.name.section',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Entity Name Tag',
			scope: 'entity.name.tag',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Entity Other Attribute Name',
			scope: 'entity.other.attribute-name',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Entity Other Attribute Name Id',
			scope: 'entity.other.attribute-name.id',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Meta Class',
			scope: 'meta.class',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Meta Class Body',
			scope: 'meta.class.body',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Meta Method Call,meta Method',
			scope: 'meta.method-call,meta.method',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Meta Definition Variable',
			scope: 'meta.definition.variable',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Meta Link',
			scope: 'meta.link',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Meta Require',
			scope: 'meta.require',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Meta Selector',
			scope: 'meta.selector',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Meta Separator',
			scope: 'meta.separator',
			settings: {
				background: '#373b41',
				foreground: '#383a42'
			}
		},
		{
			name: 'Meta Tag',
			scope: 'meta.tag',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Underline',
			scope: 'underline',
			settings: {
				'text-decoration': 'underline'
			}
		},
		{
			name: 'None',
			scope: 'none',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Invalid Deprecated',
			scope: 'invalid.deprecated',
			settings: {
				foreground: '#000000',
				background: '#f2a60d'
			}
		},
		{
			name: 'Invalid Illegal',
			scope: 'invalid.illegal',
			settings: {
				foreground: 'red',
				background: '#ff1414'
			}
		},
		{
			name: 'Markup Bold',
			scope: 'markup.bold',
			settings: {
				foreground: '#986801',
				'font-weight': 'bold'
			}
		},
		{
			name: 'Markup Changed',
			scope: 'markup.changed',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Markup Deleted',
			scope: 'markup.deleted',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Markup Italic',
			scope: 'markup.italic',
			settings: {
				foreground: '#a626a4',
				'font-style': 'italic'
			}
		},
		{
			name: 'Markup Heading',
			scope: 'markup.heading',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Markup Heading Punctuation Definition Heading',
			scope: 'markup.heading punctuation.definition.heading',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Markup Link',
			scope: 'markup.link',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Markup Inserted',
			scope: 'markup.inserted',
			settings: {
				foreground: '#50a14f'
			}
		},
		{
			name: 'Markup Quote',
			scope: 'markup.quote',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: 'Markup Raw',
			scope: 'markup.raw',
			settings: {
				foreground: '#50a14f'
			}
		},
		{
			name: 'Source C Keyword Operator',
			scope: 'source.c keyword.operator',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Cpp Keyword Operator',
			scope: 'source.cpp keyword.operator',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Cs Keyword Operator',
			scope: 'source.cs keyword.operator',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Css Property Name,source Css Property Value',
			scope: 'source.css property-name,source.css property-value',
			settings: {
				foreground: '#696c77'
			}
		},
		{
			name: 'Source Css Property Name Support,source Css Property Value Support',
			scope: 'source.css property-name.support,source.css property-value.support',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Source Gfm Markup',
			scope: 'source.gfm markup',
			settings: {
				'-webkit-font-smoothing': 'auto'
			}
		},
		{
			name: 'Source Gfm Link Entity',
			scope: 'source.gfm link entity',
			settings: {
				foreground: '#4078f2'
			}
		},
		{
			name: 'Source Go Storage Type String',
			scope: 'source.go storage.type.string',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Ini Keyword Other Definition Ini',
			scope: 'source.ini keyword.other.definition.ini',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Source Java Storage Modifier Import',
			scope: 'source.java storage.modifier.import',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Source Java Storage Type',
			scope: 'source.java storage.type',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			name: 'Source Java Keyword Operator Instanceof',
			scope: 'source.java keyword.operator.instanceof',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Java Properties Meta Key Pair',
			scope: 'source.java-properties meta.key-pair',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Source Java Properties Meta Key Pair > Punctuation',
			scope: 'source.java-properties meta.key-pair > punctuation',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: 'Source Js Keyword Operator',
			scope: 'source.js keyword.operator',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void',
			scope: 'source.js keyword.operator.delete,source.js keyword.operator.in,source.js keyword.operator.of,source.js keyword.operator.instanceof,source.js keyword.operator.new,source.js keyword.operator.typeof,source.js keyword.operator.void',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Json Meta Structure Dictionary Json > String Quoted Json',
			scope: 'source.json meta.structure.dictionary.json > string.quoted.json',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String',
			scope: 'source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: 'Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation',
			scope: 'source.json meta.structure.dictionary.json > value.json > string.quoted.json,source.json meta.structure.array.json > value.json > string.quoted.json,source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation,source.json meta.structure.array.json > value.json > string.quoted.json > punctuation',
			settings: {
				foreground: '#50a14f'
			}
		},
		{
			name: 'Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json',
			scope: 'source.json meta.structure.dictionary.json > constant.language.json,source.json meta.structure.array.json > constant.language.json',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: 'Source Ruby Constant Other Symbol > Punctuation',
			scope: 'source.ruby constant.other.symbol > punctuation',
			settings: {
				foreground: 'inherit'
			}
		},
		{
			name: 'Source Python Keyword Operator Logical Python',
			scope: 'source.python keyword.operator.logical.python',
			settings: {
				foreground: '#a626a4'
			}
		},
		{
			name: 'Source Python Variable Parameter',
			scope: 'source.python variable.parameter',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Support Type Property Name',
			scope: 'support.type.property-name',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Punctuation for Quoted String',
			scope: 'string.quoted.double punctuation',
			settings: {
				foreground: '#0184bc'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Support Constant',
			scope: 'support.constant',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JSON Property Name',
			scope: 'support.type.property-name.json',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JSON Punctuation for Property Name',
			scope: 'support.type.property-name.json punctuation',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Punctuation for key-value',
			scope: 'punctuation.separator.key-value.ts,punctuation.separator.key-value.js',
			settings: {
				foreground: '#56B6C2'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Embedded Operator',
			scope: 'source.js.embedded.html keyword.operator,source.ts.embedded.html keyword.operator',
			settings: {
				foreground: '#56B6C2'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Variable Other Readwrite',
			scope: 'variable.other.readwrite.js,variable.other.readwrite.ts',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Support Variable Dom',
			scope: 'support.variable.dom.js,support.variable.dom.ts',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Support Variable Property Dom',
			scope: 'support.variable.property.dom.js,support.variable.property.dom.ts',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Interpolation String Punctuation',
			scope: 'meta.template.expression.js punctuation.definition,meta.template.expression.ts punctuation.definition',
			settings: {
				foreground: '#BE5046'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Punctuation Type Parameters',
			scope: 'source.ts punctuation.definition.typeparameters,source.js punctuation.definition.typeparameters',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Definition Block',
			scope: 'source.ts punctuation.definition.block,source.js punctuation.definition.block',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] JS/TS Punctuation Separator Comma',
			scope: 'source.ts punctuation.separator.comma,source.js punctuation.separator.comma',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Css Support Constant Value',
			scope: 'support.constant.property-value.css',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Css Punctuation Definition Constant',
			scope: 'punctuation.definition.constant.css',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Sass Punctuation for key-value',
			scope: 'punctuation.separator.key-value.scss',
			settings: {
				foreground: '#e45649'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Sass Punctuation for constants',
			scope: 'punctuation.definition.constant.scss',
			settings: {
				foreground: '#986801'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Sass Punctuation for key-value',
			scope: 'meta.property-list.scss punctuation.separator.key-value.scss',
			settings: {
				foreground: '#383a42'
			}
		},
		{
			name: '[VSCODE-CUSTOM] Java Storage Type Primitive Array',
			scope: 'storage.type.primitive.array.java',
			settings: {
				foreground: '#c18401'
			}
		},
		{
			scope: 'token.info-token',
			settings: {
				foreground: '#316bcd'
			}
		},
		{
			scope: 'token.warn-token',
			settings: {
				foreground: '#cd9731'
			}
		},
		{
			scope: 'token.error-token',
			settings: {
				foreground: '#cd3131'
			}
		},
		{
			scope: 'token.debug-token',
			settings: {
				foreground: '#800080'
			}
		}
	]
}

export const bodyStyle = convertColorThemeToCSS(colorTheme)
