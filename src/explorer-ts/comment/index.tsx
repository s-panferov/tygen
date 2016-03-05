import * as React from 'react';
import * as theme from '../../explorer/components/theme';

require('./index.css');
const block = theme.block('ts-comment');

export interface CommentProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}

export interface CommentState {}

export default class Comment extends React.Component<CommentProps, CommentState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
            
            </div>
        );
    }
}
