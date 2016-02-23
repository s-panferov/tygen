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
    someProperty: A;
    someOtherProperty: B;
}

export interface Index<A> {
    [key: string]: A;
    [key: number]: A;

    (b: Index<A>): Index<A>;
}
