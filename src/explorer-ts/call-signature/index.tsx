import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    CallSignatureReflection
} from '../../doc/ast/type';

import Signature, { SignatureTypeStyle } from '../signature';

require('./index.css');
const block = theme.block('ts-call-signature');

export interface CallSignatureProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    signature: CallSignatureReflection;
}

export interface CallSignatureState {}

export default class CallSignature extends React.Component<CallSignatureProps, CallSignatureState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { signature } = this.props;
        return (
            <div className={ this.getClassName() }>
                <Signature
                    typeStyle={ SignatureTypeStyle.Colon }
                    signature={ signature }
                />
            </div>
        );
    }
}
