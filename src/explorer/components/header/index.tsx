import * as React from 'react';
import * as theme from '../theme';

import { Route } from '../../state';
import Breadcrumbs from '../breadcrumbs';
import File from '../file';
import SmartLink from '../smart-link';
import Search from '../search';

require('./index.css');
const block = theme.block('header');

export interface HeaderProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    route: Route;
    onNavigate: (route: Route) => void;
}
export interface HeaderState {
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
    static contextTypes = theme.themeContext;

    constructor(props, context) {
        super(props, context);

        this.state = {
        };
    }

    getClassName() {
        return block(theme.resolveTheme(this), {
        }).mix(this.props.className);
    }

    render() {
        return (
            <div
                className={ this.getClassName() }
            >
                <div className={ block('sidebar ') }>
                    { this.renderLogo() }
                </div>
                <div className={ block('content' )}>
                    <div className={ block('main') }>
                        <Breadcrumbs>
                            { this.renderRoute() }
                        </Breadcrumbs>
                    </div>
                    <div className={ block('actions') }>
                        <Search className={ block('search') } route={ this.props.route }/>
                    </div>
                </div>
            </div>
        );
    }

    renderLogo() {
        return (
            <SmartLink route={{ pkg: '', path: '' }} className={ block('logo') }>
                <span>{'// '}DocScript</span>
            </SmartLink>
        );
    }

    renderRoute() {
        let files = [];
        let route = this.props.route;

        files.push(
            <File
                key={ route.pkg }
                folder={ true }
                name={ route.pkg }
                pkg={ route.pkg }
                path={ '/' }
                className={ block('struct-item') }
                navigate={ this.props.onNavigate }
            />
        );

        if (this.props.route.path !== '/') {
            let parts = this.props.route.path.split('/').filter(Boolean);
            parts.reduce((p: string, segment: string, i: number): string => {
                let currentPath = `${ p }/${ segment }`;
                files.push(
                    <File
                        key={ `${route.pkg}-${segment}` }
                        folder={ true }
                        name={ segment }
                        pkg={ route.pkg }
                        path={ currentPath }
                        active={ i == parts.length - 1 && !route.id && !route.semanticId }
                        className={ block('struct-item') }
                        navigate={ this.props.onNavigate }
                    />
                );
                return currentPath;
            }, '');
        }

        return files;
    }
}
