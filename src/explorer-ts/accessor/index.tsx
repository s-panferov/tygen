import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection
} from '../../doc/ast/type';

import Signature, { SignatureTypeStyle } from '../signature';

require('./index.css');
const block = theme.block('ts-accessor');

export interface AccessorProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    getter?: GetAccessorDeclarationReflection;
    setter?: SetAccessorDeclarationReflection;
    inline: boolean;
}

export interface AccessorState {}

export default class Accessor extends React.Component<AccessorProps, AccessorState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let method = this.props.getter || this.props.setter;
        let type = this.props.getter
            ? 'get'
            : 'set';

        return (
            <div className={ this.getClassName() }>
                { type }
                { ' ' }
                <Signature
                    typeStyle={ SignatureTypeStyle.Colon }
                    signature={ method }
                />
            </div>
        );
    }
}
