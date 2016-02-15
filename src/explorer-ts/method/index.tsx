import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    MethodDeclarationReflection
} from '../../doc/ast/type';

import Signature, { SignatureTypeStyle } from '../signature';

require('./index.css');
const block = theme.block('ts-method');

export interface MethodProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    method: MethodDeclarationReflection;
}

export interface MethodState {}

export default class Method extends React.Component<MethodProps, MethodState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let method = this.props.method;
        return (
            <div className={ this.getClassName() }>
                <Signature
                    typeStyle={ SignatureTypeStyle.Colon }
                    signature={ method }
                />
            </div>
        );
    }
}
