import * as React from 'react';
import * as theme from '../../../components/theme';

import { InterfaceReflection } from '../../../../doc/ast/interface';
import {
    PropertySignatureReflection,
    isPropertySignatureReflection
} from '../../../../doc/ast/type';
import Heading from '../../../components/heading';
import SmartLink from '../../../components/smart-link';
import Paper from '../../../components/paper';

import Property from '../property';

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
                </Heading>
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

    // renderTypeArguments(): React.ReactChild {
    //     let typeArguments = this.props..typeArguments;
    //     if (!typeArguments) {
    //         return null;
    //     }
    //
    //     let result: React.ReactChild[] = [];
    //
    //     typeArguments.forEach((typeArg, i) => {
    //         result.push(<Type type={ typeArg } />);
    //         if (i < typeArguments.length - 1) {
    //             result.push(', ');
    //         }
    //     });
    //
    //     return <Brackets>{ result }</Brackets>;
    // }
}
