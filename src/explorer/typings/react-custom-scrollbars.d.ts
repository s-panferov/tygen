declare module 'react-custom-scrollbars' {
    import * as React from 'react';
    export interface ScrollbarsValue {
        /**
         * (Number) scrollTop progess, from 0 to 1
         */
        top: number;
        /**
         * (Number) scrollLeft progess, from 0 to 1
         */
        left: number;
        /**
         * (Number) width of the view
         */
        clientWidth: number;
        /**
         * (Number) height of the view
         */
        clientHeight: number;
        /**
         * (Number) native scrollWidth
         */
        scrollWidth: number;
        /**
         * (Number) native scrollHeight
         */
        scrollHeight: number;
        /**
         * (Number) native scrollLeft
         */
        scrollLeft: number;
        /**
         * (Number) native scrollTop
         */
        scrollTop: number;
    }

    export interface ScrollbarsProps extends React.CommonProps {
        style?: React.CSSProperties;
        onScroll?: (event: Event, values: ScrollbarsValue) => void;
        /**
         * (Function) Horizontal scrollbar element
         */
        renderScrollbarHorizontal?: (props: any) => React.ReactNode;
        /**
         * (Function) Vertical scrollbar element
         */
        renderScrollbarVertical?: (props: any) => React.ReactNode;
        /**
         * (Function) Horizontal thumb element
         */
        renderThumbHorizontal?: (props: any) => React.ReactNode;
        /**
         * (Function) Vertical thumb element
         */
        renderThumbVertical?: (props: any) => React.ReactNode;
        /**
         * The element your content will be rendered in
         */
        renderView?: (props: any) => React.ReactNode;
    }

    export class ScrollbarsRuntime {
        scrollTop(top: number): void
        scrollLeft(left): void
        scrollToTop(): void
        scrollToBottom(): void
        scrollToLeft(): void
        scrollToRight(): void
        getScrollLeft(): number
        getScrollTop(): number
        getScrollWidth(): number
        getScrollHeight(): number
        getWidth(): number
        getHeight(): number
    }

    export class Scrollbars extends React.Component<ScrollbarsProps, any> implements ScrollbarsRuntime {
        scrollTop(top: number): void
        scrollLeft(left): void
        scrollToTop(): void
        scrollToBottom(): void
        scrollToLeft(): void
        scrollToRight(): void
        getScrollLeft(): number
        getScrollTop(): number
        getScrollWidth(): number
        getScrollHeight(): number
        getWidth(): number
        getHeight(): number
    }
}
