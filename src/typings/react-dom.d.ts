/// <reference path="../../typings/react/react.d.ts" />

declare module __ReactDOM {
    function render<P>(
        element: __React.DOMElement<P>,
        container: Element,
        callback?: () => any): __React.DOMComponent<P>;
    function render<P, S>(
        element: __React.ClassicElement<P>,
        container: Element,
        callback?: () => any): __React.ClassicComponent<P, S>;
    function render<P, S>(
        element: __React.ReactElement<P>,
        container: Element,
        callback?: () => any): __React.Component<P, S>;

    function unmountComponentAtNode(container: Element): boolean;
    function renderToString(element: __React.ReactElement<any>): string;
    function renderToStaticMarkup(element: __React.ReactElement<any>): string;
    function isValidElement(object: {}): boolean;
    function initializeTouchEvents(shouldUseTouch: boolean): void;

    function findDOMNode<TElement extends Element>(
        componentOrElement: __React.Component<any, any> | Element): TElement;
    function findDOMNode(
        componentOrElement: __React.Component<any, any> | Element): Element;
}

declare module "react-dom" {
    export let findDOMNode: typeof __React.findDOMNode;
    export default __ReactDOM;
}
