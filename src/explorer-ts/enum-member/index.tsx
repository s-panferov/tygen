import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    EnumMemberReflection,
} from '../../doc/ast/enum';

import Panel from '../panel';
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
            <Panel
                key={ member.name }
                className={ this.getClassName() }
                title={ member.name }
                figure={ member.initializer }
            >
                {
                    member.comment &&
                        <Comment comment={ member.comment } />
                }
            </Panel>
        );
    }
}
