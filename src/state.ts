import {
} from './models-i';

import MemoryFileSystem from 'memory-fs';

export { MemoryFileSystem };

export interface PackageDef {
    info: any;
    path: string;
}

export interface DocPkgInfo {
    name: string;
    version: string;
    description: string;
}

export interface DocFileDef {
    relativeToPackage: string;
    withPackage: string;
    metaName: string;
}

export interface Doc {
    text: string;
    pkg: DocPkgInfo;
    fileInfo: DocFileDef;
}

export interface DocIndex {
    mainPackage: string;
    files: Dictionary<Doc>
}

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
