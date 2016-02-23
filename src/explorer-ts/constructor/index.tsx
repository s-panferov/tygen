import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ConstructorDeclarationReflection
} from '../../doc/ast/type';

import Signature from '../signature';

require('./index.css');
const block = theme.block('ts-method');

export interface ConstructorProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    ctor: ConstructorDeclarationReflection;
    inline: boolean;
}

export interface ConstructorState {}

export default class Constructor extends React.Component<ConstructorProps, ConstructorState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let ctor = this.props.ctor;
        return (
            <div className={ this.getClassName() }>
                <Signature signature={ ctor } />
            </div>
        );
    }
}
