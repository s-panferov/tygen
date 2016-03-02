import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeParameterReflection
} from '../../doc/ast/type/type-parameter';

import Brackets from '../brackets';
import TypeParameter from '../type-parameter';
import Join from '../../explorer/components/join';

require('./index.css');
const block = theme.block('ts-type-parameters');

export interface TypeParametersProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    typeParameters: TypeParameterReflection[];
    asConstraint?: boolean;
}

export interface TypeParametersState {}

export default class TypeParameters extends React.Component<TypeParametersProps, TypeParametersState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this), {
            constraint: this.props.asConstraint
        }).mix(this.props.className);
    }

    render() {
        let typeParameters = this.props.typeParameters;
        if (!typeParameters) {
            return null;
        }

        if (this.props.asConstraint) {
            return (
                <div className={ this.getClassName() }>
                    <span>where </span>
                    <div className={ block('constraints') }>
                        { this.renderContraints() }
                    </div>
                </div>
            );
        } else {
            return (
                <Brackets className={ this.getClassName() }>
                    { this.renderContraints() }
                </Brackets>
            );
        }
    }

    renderContraints() {
        let typeParameters = this.props.typeParameters;
        return (
            <Join multiline={ this.props.asConstraint }>
                {
                    typeParameters.map(typeParam => {
                        return <TypeParameter
                            asConstraint={ this.props.asConstraint}
                            key={ typeParam.id }
                            typeParam={ typeParam }
                        />;
                    })
                }
            </Join>
        );
    }
}
