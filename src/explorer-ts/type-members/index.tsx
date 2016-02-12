import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    Item
} from '../../doc/items';

import {
    PropertySignatureReflection,
    isPropertySignatureReflection
} from '../../doc/ast/type';

import Property from '../property';

require('./index.css');
const block = theme.block('ts-type-members');

export interface TypeMembersProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    members: Item[];
}

export interface TypeMembersState {}

export default class TypeMembers extends React.Component<TypeMembersProps, TypeMembersState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let members = this.props.members;
        let propertySignatures: PropertySignatureReflection[] = [];

        members.forEach(member => {
            if (isPropertySignatureReflection(member)) {
                propertySignatures.push(member);
            }
        });

        return (
            <div className={ this.getClassName() }>
                { this.renderPropertySignatures(propertySignatures) }
            </div>
        );
    }

    renderPropertySignatures(propertySignatures: PropertySignatureReflection[]) {
        return propertySignatures.map(sig => {
            return <Property property={ sig } />;
        });
    }
}
