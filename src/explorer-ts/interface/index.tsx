import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { InterfaceReflection } from '../../doc/ast/interface';
import Heading from '../../explorer/components/heading';
import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';

import TypeParameters from '../type-parameters';
import TypeMembers from '../type-members';

require('./index.css');
const block = theme.block('ts-interface');

export interface InterfaceProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: InterfaceReflection;
}

export interface InterfaceState {}

export default class Interface<P extends InterfaceProps> extends React.Component<P, InterfaceState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    getHeader() {
        return 'Interface';
    }

    render() {
        let iface = this.props.item;
        return (
            <Paper id={ iface.id } className={ this.getClassName() }>
                <Heading lvl={ 2 }>
                    { this.getHeader() }
                    <SmartLink id={ iface.id }>{ iface.name }</SmartLink>
                    { iface.typeParameters &&
                        <TypeParameters typeParameters={ iface.typeParameters }/> }
                </Heading>
                { iface.comment }
                { iface.members &&
                    <TypeMembers members={ iface.members } /> }
            </Paper>
        );
    }
}
