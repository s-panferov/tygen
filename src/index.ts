/// <reference path="defines.d.ts" />

import { render, createElement } from 'react';
import { Interface } from './interface/interface';
import { Page } from './page/page';
import * as _ from 'lodash';

let refify = require('refify');

require('./css/main.css');

var injectTapEventPlugin = require("react-tap-event-plugin");

(<any>window).docs = {};
_.forEach(require('../.docs/registry.js'), (raw, fileName) => {
    (<any>window).docs[fileName] = refify.parse(raw);
});

injectTapEventPlugin();

window.onload = () => {
    render(Page(), document.body)
};