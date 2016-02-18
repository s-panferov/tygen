import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    FunctionDeclarationReflection
} from '../../doc/ast/function';

import Signature, { SignatureTypeStyle } from '../signature';

require('./index.css');
const block = theme.block('ts-function');

export interface FunctionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: FunctionDeclarationReflection;
}

export interface FunctionState {}

export default class Function extends React.Component<FunctionProps, FunctionState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let func = this.props.item;
        return (
            <div className={ this.getClassName() }>
                function
                { func.name }
                <Signature
                    typeStyle={ SignatureTypeStyle.Colon }
                    signature={ func }
                />
            </div>
        );
    }
}
