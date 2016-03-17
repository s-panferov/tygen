import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    FunctionReflection
} from '../../doc/ast/function';

import Signature, { SignatureTypeStyle } from '../signature';
import Heading from '../../explorer/components/heading';
import Figure from '../../explorer/components/figure';
import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';
import Comment from '../comment';

require('./index.css');
const block = theme.block('ts-function');

export interface FunctionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: FunctionReflection;
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
            <Paper id={ func.selfRef.id } block={ true } highlight={ false } className={ this.getClassName() }>
                <Heading lvl={ 1 }>
                    <span>Function </span>
                    <SmartLink route={ func.selfRef }>{ func.name }</SmartLink>
                </Heading>
                { func.comment &&
                    <Comment comment={ func.comment } />
                }
                <Figure>
                    <span>function </span>
                    <Signature
                        typeStyle={ SignatureTypeStyle.Colon }
                        signature={ func.callSignatures[0] }
                    />
                </Figure>
            </Paper>
        );
    }
}
