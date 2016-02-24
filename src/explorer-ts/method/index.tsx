import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    FunctionReflection
} from '../../doc/ast/function';

import Signature, { SignatureTypeStyle } from '../signature';
import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';
import Section from '../section';
import Comment from '../comment';

require('./index.css');
const block = theme.block('ts-method');

export interface MethodProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    method: FunctionReflection;
    inline: boolean;
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
            <Paper id={ this.props.method.id } className={ this.getClassName() }>
                <Section title={ <span>fn { method.name }</span> }>
                    {
                        method.callSignatures.map(sig => {
                            return <div className={ block('signature-section') } >
                                <Figure className={ block('figure') }>
                                    <Signature
                                        className={ block('signature') }
                                        typeStyle={ SignatureTypeStyle.Colon }
                                        signature={ sig }
                                    />
                                </Figure>
                                { sig.comment &&
                                    <Comment>
                                        { sig.comment }
                                    </Comment>
                                }
                            </div>;
                        })
                    }
                </Section>
            </Paper>
        );
    }
}
