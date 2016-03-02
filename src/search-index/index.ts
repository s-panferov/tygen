self.window = self;
self.window.window = self;

import { Action, ActionType } from '../explorer/redux';
import { Search, InitSearchIndex } from '../explorer/actions';

function emit<T>(action: Action<any, any>) {
    self.postMessage(action, null);
}

let index: any;

function initSearchIndex(payload: InitSearchIndex) {
    let { settings } = payload;

    importScripts(`${settings.assetsRoot}/search-index-lib.js`);
    let { buffer, stream, level, si } = (window as any).__search_index_lib__;

    let searchIndex = fetch(`${settings.docRoot}/search-index.gz`)
        .then(res => res.arrayBuffer());

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
                emit({
                    type: ActionType.InitSearchIndex,
                    payload: { ready: true }
                } as Action<InitSearchIndex, void>);
            });
        });
    });
}

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
        case ActionType.InitSearchIndex:
            initSearchIndex(data.payload as InitSearchIndex);
            break;
        case ActionType.Search:
            search(data.payload as Search);
            break;
    };
}, false);
