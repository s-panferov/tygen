import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    EnumDeclarationReflection,
} from '../../doc/ast/enum';

import Heading from '../../explorer/components/heading';
import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';
import EnumMember from '../enum-member';

require('./index.css');
const block = theme.block('ts-enum');

export interface EnumProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: EnumDeclarationReflection;
}

export interface EnumState {}

export default class Enum<P extends EnumProps> extends React.Component<P, EnumState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    getHeader() {
        return 'Enum';
    }

    render() {
        let en = this.props.item;
        return (
            <Paper id={ en.id } className={ this.getClassName() }>
                <Heading lvl={ 2 }>
                    { this.getHeader() }
                    <SmartLink id={ en.id }>{ en.name }</SmartLink>
                </Heading>
                { en.members &&
                    this.renderMembers()
                }
            </Paper>
        );
    }

    renderMembers() {
        return (
            this.props.item.members.forEach(member => {
                return <EnumMember key={ member.id } member={ member } />;
            })
        );
    }
}
