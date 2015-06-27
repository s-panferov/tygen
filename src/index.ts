/// <reference path="defines.d.ts" />

import { render, createElement } from 'react';
import { Interface } from './interface/interface';
import { Page } from './page/page';
import { Service } from './service';

import * as _ from 'lodash';

require('./css/main.css');

var injectTapEventPlugin = require("react-tap-event-plugin");

function loadFiles() {
    return require('../.docs/registry.js')
}

let service = new Service(<any>loadFiles());

injectTapEventPlugin();

window.onload = () => {
    render(Page({ service }), document.body)
};