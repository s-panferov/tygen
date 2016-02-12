import * as React from 'react';
import * as theme from '../../explorer/components/theme';

const block = theme.block('ts-type-core');

require('./index.css');

export interface TypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    coreType: string;
}

export default class TypeCore extends React.Component<TypeProps, void> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let type = this.props.coreType;
        return (
            <div
                { ...this.props.htmlProps }
                className={ this.getClassName() }
            >
                { type }
            </div>
        );
    }
}
