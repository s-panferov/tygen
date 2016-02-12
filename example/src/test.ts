export interface Test<A extends Promise<string>, B> {
    a: A;
    b: B;
}
