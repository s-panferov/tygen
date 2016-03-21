import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { FunctionReflection } from '../../doc/ast/function';
import Interface, { InterfaceProps } from '../interface';

require('./index.css');
const block = theme.block('ts-function');

export interface FunctionProps extends InterfaceProps {
    htmlProps?: React.HTMLAttributes;
    item: FunctionReflection;
}

export interface FunctionState {}

export default class Function extends Interface<FunctionProps> {
    getClassName() {
        let iface = Interface.prototype.getClassName.call(this);
        let self = block(theme.resolveTheme(this)).mix(this.props.className);

        return iface.mix(self);
    }

    getHeader() {
        return 'Function';
    }
}
