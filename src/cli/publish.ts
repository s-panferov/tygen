import * as fs from 'fs'

let fstream = require('fstream')
let tar = require('tar')
let zlib = require('zlib')
let request = require('request')
let temp = require('temp')

import { resolveManifestSync } from './manifest'

// Automatically track and cleanup files at exit
temp.track()

interface PublishCommand {
	docDir: string
	registry: string
}

export const command = 'publish'
export const describe = 'Publish generated documentation on docscript.io'
export const builder = {
	config: {
		alias: '-c',
		default: 'docscript.json',
		describe: 'Path to your .docscript.json file',
	},
	docDir: {
		alias: '-o',
		default: 'doc',
		describe: 'Directory where generated doc is stored',
	},
	registry: {
		alias: '-r',
		default: 'docscript.io',
		describe: 'Docscript registry',
	}
}

export function handler(argv: PublishCommand) {
	let manifest = resolveManifestSync()
	let stream = temp.createWriteStream()

	console.log('Writing an archive...')

	fstream.Reader({ path: argv.docDir, type: 'Directory' }) /* Read the source directory */
		.pipe(tar.Pack()) /* Convert the directory to a .tar file */
		.pipe(zlib.Gzip()) /* Compress the .tar file */
		.pipe(stream)
		.on('finish', () => {
			console.log('Pushing the archive...')
			let readStream = fs.createReadStream(stream.path)
			let formData = {
				archive: {
					value: readStream,
					options: {
						filename: 'archive.tar.gz',
						contentType: 'application/json charset=utf-8'
					}
				},
				manifest: JSON.stringify(manifest)
			}

			request.post({
				url: `http://${argv.registry}/publish`,
				formData
			}, (err, httpResponse, body) => {
				if (err) {
					return console.error('upload failed:', err)
				}
				console.log('Upload successful!  Server responded with:', body)
			})

		})
}
