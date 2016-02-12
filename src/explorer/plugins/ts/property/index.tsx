import * as React from 'react';
import * as theme from '../../../components/theme';

import {
    PropertySignatureReflection,
} from '../../../../doc/ast/type';

import Paper from '../../../components/paper';

import Type from '../type';

require('./index.css');
const block = theme.block('ts-property');

export interface PropertyProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    property: PropertySignatureReflection;
}

export interface PropertyState {}

export default class Property extends React.Component<PropertyProps, PropertyState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let property = this.props.property;
        return (
            <Paper className={ this.getClassName() }>
                <div className={ block('signature') }>
                    { property.name }
                    { property.optional ? '?' : '' }
                    :
                    <Type className={ block('type') } type={ property.type }/>
                </div>
            </Paper>
        );
    }
}
