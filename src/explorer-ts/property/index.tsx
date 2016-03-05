import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    PropertySignatureReflection,
} from '../../doc/ast/type/property';

import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';
import Type from '../type';
import Comment from '../comment';
import Section from '../section';

require('./index.css');
const block = theme.block('ts-property');

export interface PropertyProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    property: PropertySignatureReflection;
    inline: boolean;
}

export interface PropertyState {}

export default class Property extends React.Component<PropertyProps, PropertyState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        if (this.props.inline) {
            return this.renderSignature();
        } else {
            let property = this.props.property;
            return (
                <Paper id={ this.props.property.id } block={ true } className={ this.getClassName() }>
                    <Section title={ property.name }>
                        <Figure className={ block('figure') }>
                            { this.renderSignature() }
                        </Figure>
                        { property.comment &&
                            <Comment comment={ property.comment } />
                        }
                    </Section>
                </Paper>
            );
        }
    }

    renderSignature() {
        let property = this.props.property;
        return (
            <span className={ block('signature') }>
                { property.name }
                { property.optional ? '?' : '' }
                <span>: </span>
                <Type className={ block('type') } type={ property.type }/>
            </span>
        );
    }
}
