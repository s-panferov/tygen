import generate, { CLI as GENERATE_CLI } from './generate';
import publish, { CLI as PUBLISH_CLI } from './publish';

let yargs = require('yargs');
let argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command('generate', 'Generate documentation for project', GENERATE_CLI)
    .command('publish', 'Publish generated documentation on docscript.io', PUBLISH_CLI)
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv;

if (argv._[0] === 'generate') {
    generate(argv);
}

if (argv._[0] === 'publish') {
    publish(argv);
}
