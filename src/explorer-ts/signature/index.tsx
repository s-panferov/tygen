import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import Join from '../../explorer/components/join';

import {
    SignatureReflection
} from '../../doc/ast/type';

import Brackets, { BracketsType } from '../brackets';
import Type from '../type';
import TypeParameters from '../type-parameters';
import SignatureParam from '../signature-param';

require('./index.css');
const block = theme.block('ts-signature');

export interface SignatureProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    signature: SignatureReflection;
}

export interface SignatureState {}

export default class Signature extends React.Component<SignatureProps, SignatureState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { signature } = this.props;
        return (
            <div className={ this.getClassName() }>
                { signature.typeParameters &&
                    <TypeParameters typeParameters={ signature.typeParameters }/>
                }
                <Brackets type={ BracketsType.Round }>
                    <Join>
                        {
                            signature.parameters.map(param => {
                                return <SignatureParam param={ param }/>;
                            })
                        }
                    </Join>
                </Brackets>
                <span>=></span>
                { signature.type &&
                    <Type type={ signature.type } />
                }
            </div>
        );
    }
}
