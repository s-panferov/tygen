interface CallSignatures {
    <T>(value: T): T;
    new<T>(value: T): T;
    doSmth<T>(value: T): T;
    doSmth<T>(value: T, value2: T): T;
}
