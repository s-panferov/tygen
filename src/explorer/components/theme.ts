import * as React from 'react';
import * as bemCn from 'bem-cn';

export let block: typeof bemCn = (bemCn as any).default
    ? (bemCn as any).default
    : bemCn as any;

export type ClassName = string | { toString(): string };

export enum ThemeType {
    White = 'white' as any,
};

export interface ThemeProps {
    className?: ClassName;
    theme?: ThemeType;
}

export function cloneWithClass(children: React.ReactNode, className: string | {toString: () => string}): React.ReactNode {
    if (children instanceof Array) {
        return children.map((child) => {
            return React.cloneElement(child as any, {className: className});
        });
    } else {
        return React.cloneElement(<React.ReactElement<any>>children, {className: className});
    }
}

export function resolveTheme<P extends ThemeProps>(component: React.Component<P, any>): ThemeProps {
    let result: ThemeProps = {
        theme: null,
    };

    let selfContext: ThemeProps;
    let context = component.context as any;

    if (component.props.theme) {
        result.theme = component.props.theme;
    } else {
        if (context.theme) {
            result.theme = context.theme;
        } else {
            selfContext = (<any>component).getChildContext && (<any>component).getChildContext();
            if (selfContext && selfContext.theme) {
                result.theme = selfContext.theme;
            }
        }
    }

    return result;
}

export class ThemeProvider extends React.Component<ThemeProps, void> {
    static childContextTypes: React.ValidationMap<any> = {
        theme: React.PropTypes.string,
        variant: React.PropTypes.string,
        bkg: React.PropTypes.string
    };

    getChildContext() {
        return {
            theme: this.props.theme
        };
    }

    render() {
        return (<any>this.props).children;
    }
}

export var themeContext: React.ValidationMap<any> = {
    theme: React.PropTypes.string,
};
