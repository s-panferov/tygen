import {
} from './models-i';

export interface Navigation {
    pkg: string;
    path: string;
}

export interface App {
    navigation: Navigation
}
