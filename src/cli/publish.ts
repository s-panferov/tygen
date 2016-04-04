let fstream = require('fstream');
let tar = require('tar');
let zlib = require('zlib');
let request = require('request');

interface PublishCommand {
    docDir: string;
    registry: string;
}

export default function publish(argv: PublishCommand) {
    let archiveStream = fstream.Reader({ path: argv.docDir, type: 'Directory' }) /* Read the source directory */
        .pipe(tar.Pack()) /* Convert the directory to a .tar file */
        .pipe(zlib.Gzip()); /* Compress the .tar file */

    let formData = {
      archive: {
        value: archiveStream,
        options: {
          filename: 'archive.tar.gz'
        }
      }
    };

    console.log(`pushing to http://${argv.registry}/publish`);
    request.post({
        url: `http://${argv.registry}/publish`,
        formData
    }, (err, httpResponse, body) => {
          if (err) {
            return console.error('upload failed:', err);
          }
          console.log('Upload successful!  Server responded with:', body);
    });
};

export const CLI = {
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
};
