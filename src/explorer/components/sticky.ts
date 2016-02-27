import * as React from 'react';

type ClassName = string | { toString(): string };

export interface StickyProps {
    stickyStyle?: React.CSSProperties;
    stickyClass?: ClassName;
    topOffset?: number;
    className?: ClassName;
    type?: string;

    onStickyStateChange?: (state: boolean) => void;
}

let Sticky: React.ReactCtor<StickyProps, void> = require('react-sticky');
export default Sticky;
