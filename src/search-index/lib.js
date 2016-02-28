var stream = require('stream');
var buffer = require('buffer');
var si = require('search-index');
var level = require('level-js');

window.__search_index_lib__ = {
    stream: stream,
    buffer: buffer,
    si: si,
    level: level
};
