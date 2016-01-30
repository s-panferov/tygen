import {
} from './models-i';

import MemoryFileSystem from 'memory-fs';

export { MemoryFileSystem };

export interface Navigation {
    pkg: string;
    path: string;
}

export interface Search {
    query: string;
    docs: Doc[];
    hasResults: boolean;
}

export interface App {
    navigation: Navigation
    search: Search
}

export interface Package {
    info: DocPkgInfo,
    files: Dictionary<Doc>
    fs: MemoryFileSystem
}
