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

export { BracketsType };

require('./index.css');
const block = theme.block('ts-signature');

export enum SignatureTypeStyle {
    Arrow = 'arrow' as any,
    Colon = 'colon' as any,
}

export interface SignatureProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    signature: SignatureReflection;
    typeStyle?: SignatureTypeStyle;
    bracketsType?: BracketsType;
}

export interface SignatureState {}

export default class Signature extends React.Component<SignatureProps, SignatureState> {
    static contextTypes = theme.themeContext;
    static defaultProps = {
        typeStyle: SignatureTypeStyle.Arrow,
        bracketsType: BracketsType.Round
    };

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { signature } = this.props;
        return (
            <div className={ this.getClassName() }>
                { signature.name }
                { signature.typeParameters &&
                    <TypeParameters typeParameters={ signature.typeParameters }/>
                }
                <Brackets type={ this.props.bracketsType }>
                    <Join>
                        {
                            signature.parameters.map(param => {
                                return <SignatureParam param={ param }/>;
                            })
                        }
                    </Join>
                </Brackets>
                { signature.type &&
                    [
                        <span>{ this.props.typeStyle == SignatureTypeStyle.Arrow ? '=>' : ':' }</span>,
                        <Type type={ signature.type } />
                    ]
                }
            </div>
        );
    }
}
