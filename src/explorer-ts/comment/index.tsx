import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import { Comment as DocComment } from '../../doc/ast/comment';

let ReactMarkdown = require('react-markdown');

require('./index.css');
const block = theme.block('ts-comment');

export interface CommentProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    comment: DocComment;
}

export interface CommentState {}

export default class Comment extends React.Component<CommentProps, CommentState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let comment = this.props.comment;
        return (
            <div className={ this.getClassName() }>
                <ReactMarkdown source={ comment.description } />
            </div>
        );
    }
}
