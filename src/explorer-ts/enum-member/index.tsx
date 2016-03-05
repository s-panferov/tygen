import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    EnumMemberReflection,
} from '../../doc/ast/enum';

import Paper from '../../explorer/components/paper';
import Figure from '../../explorer/components/figure';

import Section from '../section';
import Comment from '../comment';

require('./index.css');
const block = theme.block('ts-enum-member');

export interface EnumMemberProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    member: EnumMemberReflection;
}

export interface EnumMemberState {}

export default class EnumMember extends React.Component<EnumMemberProps, EnumMemberState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let member = this.props.member;
        return (
            <Paper className={ this.getClassName() }>
                <Section title={ member.name } />
                {
                    member.initializer &&
                        <Figure className={ block('figure') }>
                            { member.initializer }
                        </Figure>
                }
                {
                    member.comment &&
                        <Comment comment={ member.comment } />
                }
            </Paper>
        );
    }
}
