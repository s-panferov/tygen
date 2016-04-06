self.window = self;
self.window.window = self;

import {
    Action,
    ActionType,
    Search,
    InitSearchIndex
} from '../explorer/actions';

const fuzz = require('fuzzaldrin-plus');
import { inflateJson } from '../explorer/inflate';

function emit<T>(action: Action<any, any>) {
    self.postMessage(action, null);
}

let candidates: string[];

function initSearchIndex(payload: InitSearchIndex) {
    let { settings } = payload;

    fetch(`${settings.docRoot}/search-index.json.gz`)
        .then(res => inflateJson(res))
        .then((_candidates) => {
            candidates = _candidates;
            console.log('search index ready: ', candidates.length, 'candidates');
            emit({
                type: ActionType.InitSearchIndex,
                payload: { ready: true }
            } as Action<InitSearchIndex, void>);
        });
}

function search(payload: Search) {
    let { query } = payload;
    let searchResults = fuzz.filter(candidates, query, { maxInners: 20 }).map(str => {
        let parts = str.split(':///');
        let pkg = parts[0];
        let restPath = '/' + parts[1];
        let pathParts = restPath.split('#');
        let path = pathParts[0];
        let semanticId = pathParts[pathParts.length - 1];
        let semanticIdParts = semanticId.split('.');
        let mainSemanticId = semanticIdParts[0];

        return {
            pkg,
            path,
            semanticId,
            mainSemanticId
        };
    });
    emit({
        type: ActionType.Search,
        payload: {
            query,
            searchResults
        }
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
