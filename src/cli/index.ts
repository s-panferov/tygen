import generate, { CLI } from './generate';

let yargs = require('yargs');
let argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command('generate', 'Generate documentation for project', CLI)
    .command('publish', 'Publish generated documentation on docscript.io', {

    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv;

if (argv._[0] === 'generate') {
    generate(argv);
}
