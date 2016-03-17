import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    HeritageClauseReflection
} from '../../doc/ast/interface';

import TypeExpression from '../type-expression';

require('./index.css');
const block = theme.block('ts-interface-heritage');

export interface InterfaceHeritageProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    clauses: HeritageClauseReflection[];
}

export interface InterfaceHeritageState {}

export default class InterfaceHeritage<P extends InterfaceHeritageProps>
    extends React.Component<P, InterfaceHeritageState> {

    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let clauses = this.props.clauses;
        return (
            <div className={ this.getClassName() }>
                {
                    clauses.map(clause => {
                        return (
                            <div key={ clause.selfRef.id } className={ block('heritage') }>
                                <span>{ clause.clause } </span>
                                <span className={ block('heritage-types') }>
                                    {
                                        clause.types.map(expr => {
                                            return (
                                                <TypeExpression
                                                    key={ expr.selfRef.id }
                                                    expr={ expr } />
                                            );
                                        })
                                    }
                                </span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
