export interface Generic<A extends Promise<string>, B> {
    a: A;
    b: B;
}

export interface Index<A> {
    [key: string]: A;
    [key: number]: A;

    (b: Index<A>): Index<A>;
}
