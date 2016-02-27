import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';
import Comment from '../comment';
import Section from '../section';

import {
    IndexSignatureReflection
} from '../../doc/ast/type';

import Signature, { SignatureTypeStyle, BracketsType } from '../signature';

require('./index.css');
const block = theme.block('ts-index-signature');

export interface IndexSignatureProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    signature: IndexSignatureReflection;
    inline: boolean;
}

export interface IndexSignatureState {}

export default class IndexSignature extends React.Component<IndexSignatureProps, IndexSignatureState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render(): React.ReactElement<any> {
        let { signature } = this.props;
        if (this.props.inline) {
            return (
                <div id={ signature.id } className={ this.getClassName() }>
                    { this.renderSignature() }
                </div>
            );
        } else {
            return (
                <Paper id={ signature.id } block={ true } className={ this.getClassName() }>
                    <Section title={ signature.name }>
                        <Figure className={ block('figure') }>
                            { this.renderSignature() }
                        </Figure>
                        { signature.comment &&
                            <Comment>
                                { signature.comment }
                            </Comment>
                        }
                    </Section>
                </Paper>
            );
        }
    }

    renderSignature() {
        let { signature } = this.props;
        return (
            <Signature
                typeStyle={ SignatureTypeStyle.Colon }
                bracketsType={ BracketsType.Square }
                signature={ signature }
            />
        );
    }
}
