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

import {
    isMethodReflection,
    FunctionReflection
} from '../../doc/ast/function';

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
    inline?: boolean;
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
        let methods: FunctionReflection[] = [];
        let accessors: Accessors = { };

        members.forEach(member => {
            if (isCallSignatureReflection(member)) {
                calls.push(member);
            } else if (isIndexSignatureReflection(member)) {
                indexes.push(member);
            } else if (isPropertySignatureReflection(member)
                || isPropertyDeclarationReflection(member)) {
                properties.push(member);
            } else if (isMethodReflection(member)) {
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
                { this.renderConstructors(constructors) }
                { this.renderCalls(calls) }

                { this.renderProperties(properties) }
                { this.renderMethods(methods) }
                { this.renderAccessors(accessors) }
            </div>
        );
    }

    renderIndexes(signature: IndexSignatureReflection[]) {
        return signature.map(sig => {
            return <IndexSignature
                inline={ this.props.inline }
                key={ sig.id }
                signature={ sig }
            />;
        });
    }

    renderCalls(signature: CallSignatureReflection[]) {
        return signature.map(sig => {
            return <CallSignature
                inline={ this.props.inline }
                key={ sig.id }
                signature={ sig }
            />;
        });
    }

    renderProperties(properties: PropertyDeclarationReflection[]) {
        return properties.map(sig => {
            return <Property
                inline={ this.props.inline }
                className={ block('member') }
                key={ sig.id }
                property={ sig }
            />;
        });
    }

    renderMethods(methods: FunctionReflection[]) {
        return methods.map(method => {
            return <Method
                inline={ this.props.inline }
                className={ block('member') }
                key={ method.id }
                method={ method }
            />;
        });
    }

    renderConstructors(constructors: ConstructorDeclarationReflection[]) {
        return constructors.map(ctor => {
            return <Constructor
                inline={ this.props.inline }
                key={ ctor.id }
                ctor={ ctor }
            />;
        });
    }

    renderAccessors(accessors: Accessors) {
        return Object.keys(accessors).map(name => {
            let [getter, setter] = accessors[name];
            return [
                <Accessor
                    inline={ this.props.inline }
                    className={ block('member') }
                    key={ getter.id }
                    getter={ getter }
                />,
                <Accessor
                    inline={ this.props.inline }
                    className={ block('member') }
                    key={ setter.id }
                    setter={ setter }
                />
            ];
        });
    }
}
