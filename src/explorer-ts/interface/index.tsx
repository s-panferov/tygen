import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { InterfaceReflection } from '../../doc/ast/interface';
import {
    PropertySignatureReflection,
    isPropertySignatureReflection
} from '../../doc/ast/type';
import Heading from '../../explorer/components/heading';
import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';
import Property from '../property';

import Brackets from '../brackets';
import TypeParameter from '../type-parameter';

require('./index.css');
const block = theme.block('ts-interface');

export interface InterfaceProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    iface: InterfaceReflection;
}

export interface InterfaceState {}

export default class Interface extends React.Component<InterfaceProps, InterfaceState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let iface = this.props.iface;
        return (
            <Paper id={ iface.id } className={ this.getClassName() }>
                <Heading lvl={ 2 }>
                    Interface
                    <SmartLink id={ iface.id }>{ iface.name }</SmartLink>
                    { this.renderTypeParameters() }
                </Heading>
                { iface.comment }
                { this.renderMembers() }
            </Paper>
        );
    }

    renderMembers() {
        let iface = this.props.iface;
        let propertySignatures: PropertySignatureReflection[] = [];

        iface.members.forEach(member => {
            if (isPropertySignatureReflection(member)) {
                propertySignatures.push(member);
            }
        });

        return [
            this.renderPropertySignatures(propertySignatures)
        ];
    }

    renderPropertySignatures(propertySignatures: PropertySignatureReflection[]) {
        return propertySignatures.map(sig => {
            return <Property property={ sig } />;
        });
    }

    renderTypeParameters(): React.ReactChild {
        let typeParameters = this.props.iface.typeParameters;
        if (!typeParameters) {
            return null;
        }

        let result: React.ReactChild[] = [];

        typeParameters.forEach((typeParam, i) => {
            result.push(<TypeParameter typeParam={ typeParam } />);
            if (i < typeParameters.length - 1) {
                result.push(', ');
            }
        });

        return <Brackets>{ result }</Brackets>;
    }
}
