import { Flux } from '../flux';
import { Action, ActionType, Search } from '../actions';
import { DocR, SearchR } from '../state-i';
import allRecords from '../records';
import { List } from 'immutable';


export function search(state: SearchR, action: Action, flux: Flux): SearchR {
    switch (action.actionType) {
        case ActionType.Search: return onSearch(state, action as any, flux);
    }
}

function onSearch(state: SearchR, action: Search, flux: Flux): SearchR {
    let docs = List<DocR>();
    if (action.query.length > 3) {
        docs = flux.addons.service.searchFiles(action.query);
    }

    return new SearchR(<any>{
        query: action.query,
        docs: docs,
        hasResults: !!docs.size
    });
}
