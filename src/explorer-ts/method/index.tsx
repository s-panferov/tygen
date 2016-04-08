import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import autobind from '../../lib/autobind';

import {
    FunctionReflection
} from '../../doc/ast/function';

import Signature, { SignatureTypeStyle } from '../signature';
import Panel from '../panel';
import Figure from '../../explorer/components/figure';
import Comment from '../comment';

require('./index.css');
const block = theme.block('ts-method');

export interface MethodProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    method: FunctionReflection;
    inline: boolean;
}

export interface MethodState {
    idx: number;
}

export default class Method extends React.Component<MethodProps, MethodState> {
    static contextTypes = theme.themeContext;

    state = {
        idx: 0
    };

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let method = this.props.method;
        return (
            <Panel
                id={ this.props.method.selfRef.id }
                inline={ this.props.inline }
                className={ this.getClassName() }
                title={ method.name }
            >
                 { this.renderSignatures(method) }
            </Panel>
        );
    }

    renderSignatures(method: FunctionReflection) {
        return method.callSignatures.map((sig, idx) => {
            return <div key={ sig.selfRef.id } className={ block('signature-section') } >
                <Figure
                    className={ block('figure') }
                    clickable={ true }
                    htmlProps={{
                        'data-idx': idx,
                        onClick: this.onFigureClick
                    } as any}
                >
                    <Signature
                        className={ block('signature') }
                        typeStyle={ SignatureTypeStyle.Colon }
                        signature={ sig }
                    />
                </Figure>
                {
                    (idx == this.state.idx) &&
                        <Comment comment={ sig.comment }/>
                }
            </div>;
        });
    }

    @autobind
    onFigureClick(e: React.MouseEvent) {
        let idx = Number((e.currentTarget as any).attributes['data-idx'].nodeValue);
        this.setState({
            idx
        });
    }
}
