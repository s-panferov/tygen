declare namespace __React {
    interface CommonProps {
        children?: __React.ReactNode;
        key?: string | number;
        ref?: string | ((component: any) => any);
        className?: string | { toString(): string };
        role?: string;
    }

    interface JsxClass<P, S> extends Component<P, S> {
        render(): ReactElement<P>;
    }

    interface ReactCtor<P, S> {
        new(props: P, context: any): JsxClass<P, S>;
    }
}
