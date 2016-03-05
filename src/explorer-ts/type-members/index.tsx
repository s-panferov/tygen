import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    Item
} from '../../doc/items';

import {
    ConstructorDeclarationReflection,
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection,
    IndexSignatureReflection,
    CallSignatureReflection,
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
} from '../../doc/ast/type/signature';

import {
    PropertyDeclarationReflection,
    isPropertySignatureReflection,
    isPropertyDeclarationReflection,
} from '../../doc/ast/type/property';

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
    showInherited: boolean;
    showNonPublic: boolean;
    properties: Item[];
    indexSignatures?: IndexSignatureReflection[];
    callSignatures?: CallSignatureReflection[];
    constructSignatures?: ConstructorDeclarationReflection[];
    inline?: boolean;
}

export interface TypeMembersState {}

type Accessors = [
    GetAccessorDeclarationReflection,
    SetAccessorDeclarationReflection
][];

export default class TypeMembers extends React.Component<TypeMembersProps, TypeMembersState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let members = this.props.properties;
        let properties: PropertyDeclarationReflection[] = [];
        let methods: FunctionReflection[] = [];
        let accessors: Accessors = [];

        members.forEach(member => {
            if (isPropertySignatureReflection(member)
                || isPropertyDeclarationReflection(member)) {
                    if (!member.inherited || (member.inherited && this.props.showInherited)) {
                        properties.push(member);
                    }
            } else if (isMethodReflection(member)) {
                if (!member.inherited || (member.inherited && this.props.showInherited)) {
                    methods.push(member);
                }
            } else if (isGetAccessorDeclarationReflection(member)) {
                let accessor = accessors.find(acc => acc[1].name == member.name);
                if (accessor) {
                    accessor[0] = member;
                } else {
                    accessors.push([member, null]);
                }
            } else if (isSetAccessorDeclarationReflection(member)) {
                let accessor = accessors.find(acc => acc[0].name == member.name);
                if (accessor) {
                    accessor[1] = member;
                } else {
                    accessors.push([null, member]);
                }
            }
        });

        return (
            <div className={ this.getClassName() }>
                <div key='body' className={ block('body') }>
                    {
                        this.props.constructSignatures && !!this.props.constructSignatures.length &&
                            this.renderConstructors(this.props.constructSignatures)
                    }

                    {
                        this.props.indexSignatures && !!this.props.indexSignatures.length &&
                            this.renderIndexes(this.props.indexSignatures)
                    }

                    {
                        this.props.callSignatures && !!this.props.callSignatures.length &&
                            this.renderCalls(this.props.callSignatures)
                    }

                    {
                        !!properties.length &&
                            this.renderProperties(properties)
                    }

                    {
                        !!methods.length &&
                            this.renderMethods(methods)
                    }

                    {
                        !!accessors.length &&
                            this.renderAccessors(accessors)
                    }
                </div>
                {
                    !this.props.inline &&
                        this.renderNav(properties, methods)

                }
            </div>
        );
    }

    renderIndexes(signature: IndexSignatureReflection[]): React.ReactNode {
        let renderedIndexSignatures = signature.map(sig => {
            return <IndexSignature
                inline={ this.props.inline }
                key={ sig.id }
                signature={ sig }
            />;
        });

        if (this.props.inline) {
            return renderedIndexSignatures;
        } else {
            return (
                <Section title='Index signatures'>
                    { renderedIndexSignatures }
                </Section>
            );
        }
    }

    renderCalls(signature: CallSignatureReflection[]): React.ReactNode {
        let renderedCallSignatures = signature.map(sig => {
            return <CallSignature
                inline={ this.props.inline }
                key={ sig.id }
                signature={ sig }
            />;
        });

        if (this.props.inline) {
            return renderedCallSignatures;
        } else {
            return (
                <Section title='Call signatures'>
                    { renderedCallSignatures }
                </Section>
            );
        }
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

    renderConstructors(constructors: ConstructorDeclarationReflection[]): React.ReactNode {
        let renderedConstructors = constructors.map(ctor => {
            return <Constructor
                inline={ this.props.inline }
                key={ ctor.id }
                ctor={ ctor }
            />;
        });

        if (this.props.inline) {
            return renderedConstructors;
        } else {
            return (
                <Section title='Constructors'>
                    { renderedConstructors }
                </Section>
            );
        }
    }

    renderAccessors(accessors: Accessors): React.ReactNode {
        let renderedAccessors = accessors.map(([ getter, setter ]) => {
            return [
                getter && <Accessor
                    inline={ this.props.inline }
                    className={ block('member') }
                    key={ getter.id }
                    getter={ getter }
                />,
                setter && <Accessor
                    inline={ this.props.inline }
                    className={ block('member') }
                    key={ setter.id }
                    setter={ setter }
                />
            ];
        });

        if (this.props.inline) {
            return renderedAccessors;
        } else {
            return (
                <Section title='Accessors'>
                    { renderedAccessors }
                </Section>
            );
        }
    }

    renderNav(properties: Item[], methods: Item[]) {
        let items: Item[] = [].concat(
            properties,
            methods
        );

        return <TypeNav items={ items } />;
    }
}
