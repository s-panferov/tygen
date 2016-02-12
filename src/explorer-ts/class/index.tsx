import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { ClassReflection } from '../../doc/ast/class';
import Interface from '../interface';

require('./index.css');
const block = theme.block('ts-class');

export interface ClassProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: ClassReflection;
}

export interface ClassState {}

export default class Class extends Interface<ClassProps> {
    getClassName() {
        let iface = Interface.prototype.getClassName.call(this);
        let self = block(theme.resolveTheme(this)).mix(this.props.className);

        return iface.mix(self);
    }

    getHeader() {
        return 'Class';
    }
}
