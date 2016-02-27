import * as React from 'react';
import * as theme from '../../explorer/components/theme';

require('./index.css');
const block = theme.block('ts-section');

export interface SectionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    title: React.ReactNode;
}

export interface SectionState {}

export default class Section extends React.Component<SectionProps, SectionState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this), {
            'with-heading': !!this.props.title
        }).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                {
                    this.props.title &&
                        <div className={ block('heading') }>
                            { this.props.title }
                        </div>
                }
                <div className={ block('content') }>
                    { this.props.children }
                </div>
            </div>
        );
    }
}
