self.window = self;
self.window.window = self;

import { Action, ActionType } from '../explorer/redux';
import { Search } from '../explorer/actions';

importScripts('/assets/search-index-lib.js');
let { buffer, stream, level, si } = (window as any).__search_index_lib__;
let searchIndex = fetch('/doc/generated/search-index.gz').then(res => res.arrayBuffer());

function emit<T>(action: Action<any, any>) {
    self.postMessage(action, null);
}

let index: any;

Promise.all([searchIndex]).then(([idx]) => {
    let options = {
        indexPath: 'docscript-index',
        db: level
    };

    let buf = new buffer.Buffer(idx);
    let bufferStream = new stream.PassThrough();
    bufferStream.end(buf);

    si(options, (err, _index) => {
        index = _index;
        index.replicate(bufferStream, function(callback) {
            console.log('search index ready');
            emit({ type: ActionType.SearchIndexReady, payload: null });
        });
    });
});

function search(payload: Search) {
    let { query } = payload;
    let options = {
        query: { '*': [ query ] },
        pageSize: 50
    };
    index.search(options, function(err, searchResults) {
        emit({ type: ActionType.Search, payload: { query, searchResults }});
    });
}

addEventListener('message', function(e) {
    let data: Action<any, any> = e.data;
    switch (data.type) {
        case ActionType.Search:
            search(data.payload as Search);
            break;
    };
}, false);
