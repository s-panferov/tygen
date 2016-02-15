import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    Item
} from '../../doc/items';

import {
    PropertyDeclarationReflection,
    ConstructorDeclarationReflection,
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection,
    MethodDeclarationReflection,
    isPropertySignatureReflection,
    isPropertyDeclarationReflection,
    isConstructorDeclarationReflection,
    isMethodDeclarationReflection,
    isMethodSignatureReflection,
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
} from '../../doc/ast/type';

import Property from '../property';
import Method from '../method';
import Constructor from '../constructor';
import Accessor from '../accessor';

require('./index.css');
const block = theme.block('ts-type-members');

export interface TypeMembersProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    members: Item[];
}

export interface TypeMembersState {}

type Accessors = {[key: string]:
    [GetAccessorDeclarationReflection, SetAccessorDeclarationReflection]
};

export default class TypeMembers extends React.Component<TypeMembersProps, TypeMembersState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let members = this.props.members;
        let properties: PropertyDeclarationReflection[] = [];
        let constructors: ConstructorDeclarationReflection[] = [];
        let methods: MethodDeclarationReflection[] = [];
        let accessors: Accessors = { };

        members.forEach(member => {
            if (isPropertySignatureReflection(member)
                || isPropertyDeclarationReflection(member)) {
                properties.push(member);
            } else if (isMethodDeclarationReflection(member)
                || isMethodSignatureReflection(member)) {
                methods.push(member);
            } else if (isConstructorDeclarationReflection(member)) {
                constructors.push(member);
            } else if (isGetAccessorDeclarationReflection(member)) {
                if (!accessors[member.name]) {
                    accessors[member.name] = [member, null];
                } else {
                    accessors[member.name] = [member, accessors[member.name][1]];
                }
            } else if (isSetAccessorDeclarationReflection(member)) {
                if (!accessors[member.name]) {
                    accessors[member.name] = [null, member];
                } else {
                    accessors[member.name] = [accessors[member.name][0], member];
                }
            }
        });

        return (
            <div className={ this.getClassName() }>
                { this.renderProperties(properties) }
                { this.renderConstructors(constructors) }
                { this.renderMethods(methods) }
                { this.renderAccessors(accessors) }
            </div>
        );
    }

    renderProperties(properties: PropertyDeclarationReflection[]) {
        return properties.map(sig => {
            return <Property property={ sig } />;
        });
    }

    renderMethods(methods: MethodDeclarationReflection[]) {
        return methods.map(method => {
            return <Method method={ method } />;
        });
    }

    renderConstructors(constructors: ConstructorDeclarationReflection[]) {
        return constructors.map(ctor => {
            return <Constructor ctor={ ctor } />;
        });
    }

    renderAccessors(accessors: Accessors) {
        return Object.keys(accessors).map(name => {
            let [getter, setter] = accessors[name];
            return [
                <Accessor getter={ getter } />,
                <Accessor setter={ setter } />
            ];
        });
    }
}
