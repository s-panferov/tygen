import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import Join from '../../explorer/components/join';

import {
    TupleTypeReflection,
} from '../../doc/ast/type';

import Brackets, { BracketsType } from '../brackets';
import Type from '../type';

require('./index.css');
const block = theme.block('ts-union');

export interface TupleTypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: TupleTypeReflection;
}

export interface TupleTypeState {}

export default class TupleType extends React.Component<TupleTypeProps, TupleTypeState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let types = this.props.type.elementTypes;
        return <Brackets type={ BracketsType.Square }>
            <Join>
                {
                    types.map((type, i) => {
                        return <Type key={ type.id } type={ type } />;
                    })
                }
            </Join>
        </Brackets>;
    }
}
