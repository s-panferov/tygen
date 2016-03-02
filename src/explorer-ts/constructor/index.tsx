import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ConstructorDeclarationReflection
} from '../../doc/ast/type/signature';

import Signature from '../signature';

import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';
import Comment from '../comment';
import Section from '../section';

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
        if (this.props.inline) {
            return (
                <div id={ ctor.id } className={ this.getClassName() }>
                    { this.renderSignature() }
                </div>
            );
        } else {
            return (
                <Paper id={ ctor.id } block={ true } className={ this.getClassName() }>
                    <Section title={ ctor.name }>
                        <Figure className={ block('figure') }>
                            { this.renderSignature() }
                        </Figure>
                        { ctor.comment &&
                            <Comment>
                                { ctor.comment }
                            </Comment>
                        }
                    </Section>
                </Paper>
            );
        }
    }

    renderSignature() {
        let ctor = this.props.ctor;
        return (
            <Signature signature={ ctor } />
        );
    }
}
