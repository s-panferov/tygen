import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    EnumMemberReflection,
} from '../../doc/ast/enum';

import Paper from '../../explorer/components/paper';

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
                { member.name }
                { member.initializer &&
                    [
                        '=',
                        member.initializer
                    ]
                }
            </Paper>
        );
    }
}
