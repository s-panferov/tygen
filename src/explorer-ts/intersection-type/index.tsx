import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import UnionType from '../union-type';

require('./index.css');
const block = theme.block('ts-intersection');

const SEPARATOR = (idx: number) => <span key={ `sep-${ idx }` }>{ ' & ' }</span>;
export default class IntersectionType extends UnionType {
    getSeparator() {
        return SEPARATOR;
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }
}
