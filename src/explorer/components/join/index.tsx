import * as React from 'react';
import * as theme from '../theme';

export interface JoinProps extends React.CommonProps {
    separator?: (idx: number) => React.ReactNode;
}

export interface JoinState { }

require('./index.css');

let block = theme.block('join');

const SEPARATOR = (idx: number) => <span key={ `sep-${idx}` } className={ block('sep') }>,</span>;

export default class Join extends React.Component<JoinProps, JoinState> {
    static contextTypes = theme.themeContext;
    static defaultProps = {
        separator: SEPARATOR
    };

    getClassName() {
        return block(
            theme.resolveTheme(this),
            {
            }
        ).mix(this.props.className);
    }

    joinChildren() {
        let resultChildren: React.ReactNode[] = [];
        let maxIdx = React.Children.count(this.props.children) - 1;

        React.Children.forEach(this.props.children, (child, idx) => {
            resultChildren.push(child);
            if (idx < maxIdx) {
                resultChildren.push(this.props.separator(idx));
            }
        });

        return resultChildren;
    }

    render() {
        return (
            <span className={ this.getClassName() }>{ this.joinChildren() }</span>
        );
    }
}
