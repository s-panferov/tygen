import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection
} from '../../doc/ast/type';

import Signature, { SignatureTypeStyle } from '../signature';

import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';
import Comment from '../comment';
import Section from '../section';

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
        if (this.props.inline) {
            return (
                <div id={ method.id } className={ this.getClassName() }>
                    { this.renderSignature(method, type) }
                </div>
            );
        } else {
            return (
                <Paper id={ method.id } block={ true } className={ this.getClassName() }>
                    <Section title={ type + ' ' + method.name }>
                        <Figure className={ block('figure') }>
                            { this.renderSignature(method, type) }
                        </Figure>
                        { method.comment &&
                            <Comment>
                                { method.comment }
                            </Comment>
                        }
                    </Section>
                </Paper>
            );
        }
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
