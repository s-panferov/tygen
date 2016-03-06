import * as React from 'react';

/**
 * The visitNode function is used to visit single-node
 * branches of a tree. It also provides a facility
 * for converting an array of nodes (in the form of
 * a NodeArrayNode) into a single node, for cases
 * such as converting a single-statement branch of
 * an IterationStatement into a Block.
 */
export interface Generic
    <A extends Promise<string>, B>
    extends Promise<string>, Array<A> {

    /**
     * The visitNode function is used to visit single-node
     * branches of a tree. It also provides a facility
     * for converting an array of nodes
     */
    someProperty: A;
    someOtherProperty: B;
    enumProperty?: Test;

    component: React.ReactNode;
}

export interface Index<A> {
    [key: string]: A;
    [key: number]: A;

    (b: Index<A>): Index<A>;
}

export enum Test {
    One = 'One' as any,
    Two = 'Two' as any,
    Three = 'Three' as any,
}
