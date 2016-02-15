import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import Join from '../../explorer/components/join';

import {
    UnionTypeReflection,
} from '../../doc/ast/type';

import Brackets from '../brackets';
import Type from '../type';

require('./index.css');
const block = theme.block('ts-union');

export interface UnionTypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: UnionTypeReflection;
}

export interface UnionTypeState {}

const SEPARATOR = (idx: number) => <span key={ `sep-${ idx }` }>|</span>;

export default class UnionType extends React.Component<UnionTypeProps, UnionTypeState> {
    static contextTypes = theme.themeContext;

    getSeparator() {
        return SEPARATOR;
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let types = this.props.type.types;
        return <Brackets>
            <Join separator={ this.getSeparator() }>
                {
                    types.map((typeArg, i) => {
                        return <Type type={ typeArg } />;
                    })
                }
            </Join>
        </Brackets>;
    }
}
