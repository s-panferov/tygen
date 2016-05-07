import * as generate from './generate';
import * as publish from './publish';

let yargs = require('yargs');
yargs
    .usage('Usage: $0 <command> [options]')
    .command(generate)
    .command(publish)
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .argv;