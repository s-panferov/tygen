import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ArrayTypeReflection,
} from '../../doc/ast/type/array';

import Type from '../type';

require('./index.css');
const block = theme.block('ts-array-type');

export interface ArrayTypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: ArrayTypeReflection;
}

export interface ArrayTypeState {}

const SEPARATOR = (idx: number) => <span key={ `sep-${ idx }` }>|</span>;

export default class ArrayType extends React.Component<ArrayTypeProps, ArrayTypeState> {
    static contextTypes = theme.themeContext;

    getSeparator() {
        return SEPARATOR;
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let type = this.props.type;
        return (
            <span className={ this.getClassName() }>
                <Type type={ type.elementType } />
                []
            </span>
        );
    }
}
