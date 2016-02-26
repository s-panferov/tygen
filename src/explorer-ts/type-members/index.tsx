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
    IndexSignatureReflection,
    CallSignatureReflection,
    isPropertySignatureReflection,
    isPropertyDeclarationReflection,
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
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
import Section from '../section';
import TypeNav from '../type-nav';

require('./index.css');
const block = theme.block('ts-type-members');

export interface TypeMembersProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    properties: Item[];
    indexSignatures?: IndexSignatureReflection[];
    callSignatures?: CallSignatureReflection[];
    constructSignatures?: ConstructorDeclarationReflection[];
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
        let members = this.props.properties;
        let properties: PropertyDeclarationReflection[] = [];
        let methods: FunctionReflection[] = [];
        let accessors: Accessors = { };

        members.forEach(member => {
            if (isPropertySignatureReflection(member)
                || isPropertyDeclarationReflection(member)) {
                    properties.push(member);
            } else if (isMethodReflection(member)) {
                methods.push(member);
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
                <div key='body' className={ block('body') }>
                    { this.props.constructSignatures &&
                        this.renderConstructors(this.props.constructSignatures)
                    }
                    { this.props.indexSignatures &&
                        this.renderIndexes(this.props.indexSignatures)
                    }
                    { this.props.callSignatures &&
                        this.renderCalls(this.props.callSignatures)
                    }

                    { this.renderProperties(properties) }
                    { this.renderMethods(methods) }
                    { this.renderAccessors(accessors) }
                </div>
                {
                    !this.props.inline &&
                        this.renderNav(properties, methods)

                }
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

    renderProperties(properties: PropertyDeclarationReflection[]): React.ReactNode {
        let renderedProperties = properties.map(sig => {
            return <Property
                inline={ this.props.inline }
                className={ block('member') }
                key={ sig.id }
                property={ sig }
            />;
        });
        if (this.props.inline) {
            return renderedProperties;
        } else {
            return (
                <Section title='Properties'>
                    { renderedProperties }
                </Section>
            );
        }
    }

    renderMethods(methods: FunctionReflection[]): React.ReactNode {
        let renderedMethods = methods.map(method => {
            return <Method
                inline={ this.props.inline }
                className={ block('member') }
                key={ method.id }
                method={ method }
            />;
        });
        if (this.props.inline) {
            return renderedMethods;
        } else {
            return (
                <Section title='Methods'>
                    { renderedMethods }
                </Section>
            );
        }
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

    renderNav(properties: Item[], methods: Item[]) {
        let items: Item[] = [].concat(
            this.props.constructSignatures || [],
            this.props.indexSignatures || [],
            this.props.callSignatures || [],
            properties,
            methods
        );

        return <TypeNav items={ items } />;
    }
}
