import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    InterfaceReflection,
} from '../../doc/ast/interface';

import Heading from '../../explorer/components/heading';
import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';

import TypeParameters from '../type-parameters';
import TypeMembers from '../type-members';
import InterfaceHeritage from '../interface-heritage';
import Comment from '../comment';

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
        let tpWithConstraint = iface.typeParameters &&
            iface.typeParameters.filter(tp => {
                return !!tp.constraint;
            });
        return (
            <Paper id={ iface.id } className={ this.getClassName() }>
                <Heading lvl={ 2 }>
                    <span>{ this.getHeader() } </span>
                    <SmartLink id={ iface.id }>{ iface.name }</SmartLink>
                    { iface.typeParameters &&
                        <TypeParameters
                            asConstraint={ false }
                            typeParameters={ iface.typeParameters }
                            />
                    }
                </Heading>
                <div className={ block('constraints') }>
                    { tpWithConstraint && !!tpWithConstraint.length &&
                        <TypeParameters
                            asConstraint={ true }
                            typeParameters={ tpWithConstraint }/>
                    }
                </div>
                <div className={ block('heritage') }>
                    { iface.heritageClauses &&
                        <InterfaceHeritage clauses={ iface.heritageClauses }/> }
                </div>
                <Comment className={ block('comment') }>
                    { iface.comment }
                </Comment>
                { iface.properties &&
                    <TypeMembers members={ iface.properties } /> }
            </Paper>
        );
    }
}
