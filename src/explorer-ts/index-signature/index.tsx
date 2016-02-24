import * as React from 'react';
import * as theme from '../../explorer/components/theme';

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

    render() {
        let { signature } = this.props;
        return (
            <div id={ this.props.signature.id } className={ this.getClassName() }>
                <Signature
                    typeStyle={ SignatureTypeStyle.Colon }
                    bracketsType={ BracketsType.Square }
                    signature={ signature }
                />
            </div>
        );
    }
}
