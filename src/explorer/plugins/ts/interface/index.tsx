import * as React from 'react';
import * as theme from 'docscript/src/explorer/components/theme';

import { InterfaceReflection } from 'docscript/src/doc/ast/interface';
import Heading from 'docscript/src/explorer/components/heading';
import Link from 'docscript/src/explorer/components/link';
import Paper from 'docscript/src/explorer/components/paper';

require('./index.css');
const block = theme.block('ts-interface');

export interface InterfaceProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    iface: InterfaceReflection;
}

export interface InterfaceState {}

export default class Interface extends React.Component<InterfaceProps, InterfaceState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let iface = this.props.iface;
        return (
            <Paper className={ this.getClassName() }>
                <Heading lvl={ 2 }>Interface <Link>{ iface.name }</Link></Heading>
            </Paper>
        );
    }
}
