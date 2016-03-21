import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection
} from '../../doc/ast/type/signature';

import Signature, { SignatureTypeStyle } from '../signature';

import Comment from '../comment';
import Panel from '../panel';

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
        let [method, type] = this.getInfo();
        return (
            <Panel
                id={ method.selfRef.id }
                title={ method.name }
                inline={ this.props.inline }
                figure={ this.renderSignature(method, type) }
                className={ this.getClassName() }
            >
                { method.comment &&
                    <Comment comment={ method.comment }/>
                }
            </Panel>
        );
    }

    getInfo(): [GetAccessorDeclarationReflection|SetAccessorDeclarationReflection, string] {
        let method = this.props.getter || this.props.setter;
        let type = this.props.getter
            ? 'get'
            : 'set';

        return [method, type];
    };

    renderSignature(method: GetAccessorDeclarationReflection|SetAccessorDeclarationReflection, type: string): React.ReactNode {
        return [
            type,
            ' ',
            <Signature
                typeStyle={ SignatureTypeStyle.Colon }
                signature={ method }
            />
        ];
    }
}
