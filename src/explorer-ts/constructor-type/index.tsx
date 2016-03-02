import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ConstructorTypeReflection
} from '../../doc/ast/type/signature';

import Signature from '../signature';

require('./index.css');
const block = theme.block('ts-constructor-type');

export interface ConstructorTypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: ConstructorTypeReflection;
}

export interface ConstructorTypeState {}

export default class Constructor extends React.Component<ConstructorTypeProps, ConstructorTypeState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let type = this.props.type;
        return (
            <div className={ this.getClassName() }>
                <Signature signature={ type } />
            </div>
        );
    }
}
