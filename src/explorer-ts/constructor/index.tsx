import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ConstructorDeclarationReflection
} from '../../doc/ast/type/signature';

import Signature from '../signature';

import Comment from '../comment';
import Panel from '../panel';

require('./index.css');
const block = theme.block('ts-method');

export interface ConstructorProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    ctor: ConstructorDeclarationReflection;
    inline: boolean;
}

export interface ConstructorState {}

export default class Constructor extends React.Component<ConstructorProps, ConstructorState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { ctor } = this.props;
        return (
            <Panel
                id={ ctor.selfRef.id }
                title={ ctor.name }
                inline={ this.props.inline }
                figure={ this.renderSignature() }
                className={ this.getClassName() }
            >
                { ctor.comment &&
                    <Comment comment={ ctor.comment }/>
                }
            </Panel>
        );
    }

    renderSignature() {
        let ctor = this.props.ctor;
        return (
            <Signature signature={ ctor } />
        );
    }
}
