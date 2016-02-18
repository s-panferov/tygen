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
    IndexSignatureReflection,
    CallSignatureReflection,
    isPropertySignatureReflection,
    isPropertyDeclarationReflection,
    isConstructorDeclarationReflection,
    isMethodDeclarationReflection,
    isMethodSignatureReflection,
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
    isIndexSignatureReflection,
    isCallSignatureReflection,
} from '../../doc/ast/type';

import Property from '../property';
import Method from '../method';
import Constructor from '../constructor';
import Accessor from '../accessor';
import IndexSignature from '../index-signature';
import CallSignature from '../call-signature';

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
        let indexes: IndexSignatureReflection[] = [];
        let calls: CallSignatureReflection[] = [];
        let properties: PropertyDeclarationReflection[] = [];
        let constructors: ConstructorDeclarationReflection[] = [];
        let methods: MethodDeclarationReflection[] = [];
        let accessors: Accessors = { };

        members.forEach(member => {
            if (isCallSignatureReflection(member)) {
                calls.push(member);
            } else if (isIndexSignatureReflection(member)) {
                indexes.push(member);
            } else if (isPropertySignatureReflection(member)
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
                { this.renderIndexes(indexes) }
                { this.renderCalls(calls) }
                { this.renderProperties(properties) }
                { this.renderConstructors(constructors) }
                { this.renderMethods(methods) }
                { this.renderAccessors(accessors) }
            </div>
        );
    }

    renderIndexes(signature: IndexSignatureReflection[]) {
        return signature.map(sig => {
            return <IndexSignature key={ sig.id } signature={ sig } />;
        });
    }

    renderCalls(signature: CallSignatureReflection[]) {
        return signature.map(sig => {
            return <CallSignature key={ sig.id } signature={ sig } />;
        });
    }

    renderProperties(properties: PropertyDeclarationReflection[]) {
        return properties.map(sig => {
            return <Property key={ sig.id } property={ sig } />;
        });
    }

    renderMethods(methods: MethodDeclarationReflection[]) {
        return methods.map(method => {
            return <Method key={ method.id } method={ method } />;
        });
    }

    renderConstructors(constructors: ConstructorDeclarationReflection[]) {
        return constructors.map(ctor => {
            return <Constructor key={ ctor.id } ctor={ ctor } />;
        });
    }

    renderAccessors(accessors: Accessors) {
        return Object.keys(accessors).map(name => {
            let [getter, setter] = accessors[name];
            return [
                <Accessor key={ getter.id } getter={ getter } />,
                <Accessor key={ setter.id } setter={ setter } />
            ];
        });
    }
}
