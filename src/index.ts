/// <reference path="defines.d.ts" />

import { render, createElement } from 'react';
import { Interface } from './interface/interface';
import { Page } from './page/page';

require('./css/main.css');

var injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

window.onload = () => {
    render(Page(), document.body)
};