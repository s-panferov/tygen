import * as Immutable from 'immutable';

import {
PackageDef,
DocPkgInfo,
DocFileDef,
Doc,
DocIndex,
Navigation,
Search,
App,
Package,
MemoryFileSystem,
} from './state';

export {
PackageDef,
DocPkgInfo,
DocFileDef,
Doc,
DocIndex,
Navigation,
Search,
App,
Package,
MemoryFileSystem,
};

export interface RecordClass<T extends Immutable.Map<string, void>> {
    new (): T;
    new (values: T): T;
}

export interface RecordCtor<R, T extends Immutable.Map<string, any>> {
    (defaultValues: T | R, name?: string): RecordClass<T>
}

function fromJSDefault(json) {
    if (Array.isArray(json)) {
        return (Immutable.Seq as any).Indexed(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
        return (Immutable.Seq as any).Keyed(json).map(fromJSDefault).toMap();
    }
    return json;
}

function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
}

    

/**
* Map interface for PackageDef with specialized getters and setters.
*/

export interface PackageDefRecordShape extends Immutable.Map<string, any> {

    $PackageDefRecordShape: PackageDefRecordShape

    info: any
    get(key: 'info', defaultValue?: any): any
    set(key: 'info', value: any): PackageDefRecordShape

    path: string
    get(key: 'path', defaultValue?: string): string
    set(key: 'path', value: string): PackageDefRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): PackageDefRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): PackageDefRecordShape;
    remove(key: string): PackageDefRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): PackageDefRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: PackageDefRecordShape) => PackageDefRecordShape): PackageDefRecordShape;
    update(key: string, updater: (value: any) => any): PackageDefRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): PackageDefRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): PackageDefRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): PackageDefRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): PackageDefRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): PackageDefRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): PackageDefRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): PackageDefRecordShape;
    removeIn(keyPath: Array<any>): PackageDefRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): PackageDefRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): PackageDefRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): PackageDefRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): PackageDefRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): PackageDefRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageDefRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: PackageDefRecordShape) => any): PackageDefRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): PackageDefRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): PackageDefRecordShape;

    toJS(): PackageDef


}


/**
 * Default fields that must be provided in PackageDefRecord.
 */
export interface PackageDefRecordDefaults {
    info: any
    path: string
}

/**
 * Typed PackageDefRecord constructor.
 */
export let PackageDefRecordCtor: RecordCtor<PackageDefRecordDefaults, PackageDefRecordShape> = Immutable.Record as any;

/**
 * Special method to parse PackageDefRecord with all the dependencies.
 */
export function parsePackageDefR(value: PackageDef, deps: any): PackageDefRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.PackageDefR(result);
}

export class PackageDefR extends PackageDefRecordCtor({
    info: null,
    path: null,
}) {
    static fromJS(value: PackageDef, deps: any): PackageDefR {
        return parsePackageDefR(value, deps)
    }
}

    

/**
* Map interface for DocPkgInfo with specialized getters and setters.
*/

export interface DocPkgInfoRecordShape extends Immutable.Map<string, any> {

    $DocPkgInfoRecordShape: DocPkgInfoRecordShape

    name: string
    get(key: 'name', defaultValue?: string): string
    set(key: 'name', value: string): DocPkgInfoRecordShape

    version: string
    get(key: 'version', defaultValue?: string): string
    set(key: 'version', value: string): DocPkgInfoRecordShape

    description: string
    get(key: 'description', defaultValue?: string): string
    set(key: 'description', value: string): DocPkgInfoRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): DocPkgInfoRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): DocPkgInfoRecordShape;
    remove(key: string): DocPkgInfoRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): DocPkgInfoRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: DocPkgInfoRecordShape) => DocPkgInfoRecordShape): DocPkgInfoRecordShape;
    update(key: string, updater: (value: any) => any): DocPkgInfoRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): DocPkgInfoRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): DocPkgInfoRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): DocPkgInfoRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): DocPkgInfoRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): DocPkgInfoRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): DocPkgInfoRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): DocPkgInfoRecordShape;
    removeIn(keyPath: Array<any>): DocPkgInfoRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): DocPkgInfoRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): DocPkgInfoRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocPkgInfoRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): DocPkgInfoRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocPkgInfoRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocPkgInfoRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: DocPkgInfoRecordShape) => any): DocPkgInfoRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): DocPkgInfoRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): DocPkgInfoRecordShape;

    toJS(): DocPkgInfo


}


/**
 * Default fields that must be provided in DocPkgInfoRecord.
 */
export interface DocPkgInfoRecordDefaults {
    name: string
    version: string
    description: string
}

/**
 * Typed DocPkgInfoRecord constructor.
 */
export let DocPkgInfoRecordCtor: RecordCtor<DocPkgInfoRecordDefaults, DocPkgInfoRecordShape> = Immutable.Record as any;

/**
 * Special method to parse DocPkgInfoRecord with all the dependencies.
 */
export function parseDocPkgInfoR(value: DocPkgInfo, deps: any): DocPkgInfoRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.DocPkgInfoR(result);
}

export class DocPkgInfoR extends DocPkgInfoRecordCtor({
    name: null,
    version: null,
    description: null,
}) {
    static fromJS(value: DocPkgInfo, deps: any): DocPkgInfoR {
        return parseDocPkgInfoR(value, deps)
    }
}

    

/**
* Map interface for DocFileDef with specialized getters and setters.
*/

export interface DocFileDefRecordShape extends Immutable.Map<string, any> {

    $DocFileDefRecordShape: DocFileDefRecordShape

    relativeToPackage: string
    get(key: 'relativeToPackage', defaultValue?: string): string
    set(key: 'relativeToPackage', value: string): DocFileDefRecordShape

    withPackage: string
    get(key: 'withPackage', defaultValue?: string): string
    set(key: 'withPackage', value: string): DocFileDefRecordShape

    metaName: string
    get(key: 'metaName', defaultValue?: string): string
    set(key: 'metaName', value: string): DocFileDefRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): DocFileDefRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): DocFileDefRecordShape;
    remove(key: string): DocFileDefRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): DocFileDefRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: DocFileDefRecordShape) => DocFileDefRecordShape): DocFileDefRecordShape;
    update(key: string, updater: (value: any) => any): DocFileDefRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): DocFileDefRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): DocFileDefRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): DocFileDefRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): DocFileDefRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): DocFileDefRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): DocFileDefRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): DocFileDefRecordShape;
    removeIn(keyPath: Array<any>): DocFileDefRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): DocFileDefRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): DocFileDefRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocFileDefRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): DocFileDefRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocFileDefRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocFileDefRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: DocFileDefRecordShape) => any): DocFileDefRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): DocFileDefRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): DocFileDefRecordShape;

    toJS(): DocFileDef


}


/**
 * Default fields that must be provided in DocFileDefRecord.
 */
export interface DocFileDefRecordDefaults {
    relativeToPackage: string
    withPackage: string
    metaName: string
}

/**
 * Typed DocFileDefRecord constructor.
 */
export let DocFileDefRecordCtor: RecordCtor<DocFileDefRecordDefaults, DocFileDefRecordShape> = Immutable.Record as any;

/**
 * Special method to parse DocFileDefRecord with all the dependencies.
 */
export function parseDocFileDefR(value: DocFileDef, deps: any): DocFileDefRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.DocFileDefR(result);
}

export class DocFileDefR extends DocFileDefRecordCtor({
    relativeToPackage: null,
    withPackage: null,
    metaName: null,
}) {
    static fromJS(value: DocFileDef, deps: any): DocFileDefR {
        return parseDocFileDefR(value, deps)
    }
}

    

/**
* Map interface for Doc with specialized getters and setters.
*/

export interface DocRecordShape extends Immutable.Map<string, any> {

    $DocRecordShape: DocRecordShape

    text: string
    get(key: 'text', defaultValue?: string): string
    set(key: 'text', value: string): DocRecordShape

    pkg: DocPkgInfoR
    get(key: 'pkg', defaultValue?: DocPkgInfoR): DocPkgInfoR
    set(key: 'pkg', value: DocPkgInfoR): DocRecordShape

    fileInfo: DocFileDefR
    get(key: 'fileInfo', defaultValue?: DocFileDefR): DocFileDefR
    set(key: 'fileInfo', value: DocFileDefR): DocRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): DocRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): DocRecordShape;
    remove(key: string): DocRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): DocRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: DocRecordShape) => DocRecordShape): DocRecordShape;
    update(key: string, updater: (value: any) => any): DocRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): DocRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): DocRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): DocRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): DocRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): DocRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): DocRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): DocRecordShape;
    removeIn(keyPath: Array<any>): DocRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): DocRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): DocRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): DocRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: DocRecordShape) => any): DocRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): DocRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): DocRecordShape;

    toJS(): Doc


}


/**
 * Default fields that must be provided in DocRecord.
 */
export interface DocRecordDefaults {
    text: string
    pkg: DocPkgInfoR
    fileInfo: DocFileDefR
}

/**
 * Typed DocRecord constructor.
 */
export let DocRecordCtor: RecordCtor<DocRecordDefaults, DocRecordShape> = Immutable.Record as any;

/**
 * Special method to parse DocRecord with all the dependencies.
 */
export function parseDocR(value: Doc, deps: any): DocRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'pkg':
                return deps.DocPkgInfoR.fromJS(value, deps);

            case key == 'fileInfo':
                return deps.DocFileDefR.fromJS(value, deps);

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.DocR(result);
}

export class DocR extends DocRecordCtor({
    text: null,
    pkg: new DocPkgInfoR(),
    fileInfo: new DocFileDefR(),
}) {
    static fromJS(value: Doc, deps: any): DocR {
        return parseDocR(value, deps)
    }
}

    

/**
* Map interface for DocIndex with specialized getters and setters.
*/

export interface DocIndexRecordShape extends Immutable.Map<string, any> {

    $DocIndexRecordShape: DocIndexRecordShape

    mainPackage: string
    get(key: 'mainPackage', defaultValue?: string): string
    set(key: 'mainPackage', value: string): DocIndexRecordShape

    files: Immutable.Map<string, DocR>
    get(key: 'files', defaultValue?: Immutable.Map<string, DocR>): Immutable.Map<string, DocR>
    set(key: 'files', value: Immutable.Map<string, DocR>): DocIndexRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): DocIndexRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): DocIndexRecordShape;
    remove(key: string): DocIndexRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): DocIndexRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: DocIndexRecordShape) => DocIndexRecordShape): DocIndexRecordShape;
    update(key: string, updater: (value: any) => any): DocIndexRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): DocIndexRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): DocIndexRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): DocIndexRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): DocIndexRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): DocIndexRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): DocIndexRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): DocIndexRecordShape;
    removeIn(keyPath: Array<any>): DocIndexRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): DocIndexRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): DocIndexRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocIndexRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): DocIndexRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): DocIndexRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): DocIndexRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: DocIndexRecordShape) => any): DocIndexRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): DocIndexRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): DocIndexRecordShape;

    toJS(): DocIndex


}


/**
 * Default fields that must be provided in DocIndexRecord.
 */
export interface DocIndexRecordDefaults {
    mainPackage: string
    files: Immutable.Map<string, DocR>
}

/**
 * Typed DocIndexRecord constructor.
 */
export let DocIndexRecordCtor: RecordCtor<DocIndexRecordDefaults, DocIndexRecordShape> = Immutable.Record as any;

/**
 * Special method to parse DocIndexRecord with all the dependencies.
 */
export function parseDocIndexR(value: DocIndex, deps: any): DocIndexRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'files':
                let map = {};
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        map[key] = deps.DocR.fromJS(value[key], deps);
                    }
                }
                return Immutable.Map(map);

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.DocIndexR(result);
}

export class DocIndexR extends DocIndexRecordCtor({
    mainPackage: null,
    files: Immutable.Map<string, DocR>(),
}) {
    static fromJS(value: DocIndex, deps: any): DocIndexR {
        return parseDocIndexR(value, deps)
    }
}

    

/**
* Map interface for Navigation with specialized getters and setters.
*/

export interface NavigationRecordShape extends Immutable.Map<string, any> {

    $NavigationRecordShape: NavigationRecordShape

    pkg: string
    get(key: 'pkg', defaultValue?: string): string
    set(key: 'pkg', value: string): NavigationRecordShape

    path: string
    get(key: 'path', defaultValue?: string): string
    set(key: 'path', value: string): NavigationRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): NavigationRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): NavigationRecordShape;
    remove(key: string): NavigationRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): NavigationRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: NavigationRecordShape) => NavigationRecordShape): NavigationRecordShape;
    update(key: string, updater: (value: any) => any): NavigationRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): NavigationRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): NavigationRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): NavigationRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): NavigationRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): NavigationRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): NavigationRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): NavigationRecordShape;
    removeIn(keyPath: Array<any>): NavigationRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): NavigationRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): NavigationRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): NavigationRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): NavigationRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): NavigationRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): NavigationRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: NavigationRecordShape) => any): NavigationRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): NavigationRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): NavigationRecordShape;

    toJS(): Navigation


}


/**
 * Default fields that must be provided in NavigationRecord.
 */
export interface NavigationRecordDefaults {
    pkg: string
    path: string
}

/**
 * Typed NavigationRecord constructor.
 */
export let NavigationRecordCtor: RecordCtor<NavigationRecordDefaults, NavigationRecordShape> = Immutable.Record as any;

/**
 * Special method to parse NavigationRecord with all the dependencies.
 */
export function parseNavigationR(value: Navigation, deps: any): NavigationRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.NavigationR(result);
}

export class NavigationR extends NavigationRecordCtor({
    pkg: null,
    path: null,
}) {
    static fromJS(value: Navigation, deps: any): NavigationR {
        return parseNavigationR(value, deps)
    }
}

    

/**
* Map interface for Search with specialized getters and setters.
*/

export interface SearchRecordShape extends Immutable.Map<string, any> {

    $SearchRecordShape: SearchRecordShape

    query: string
    get(key: 'query', defaultValue?: string): string
    set(key: 'query', value: string): SearchRecordShape

    docs: Immutable.List<DocR>
    get(key: 'docs', defaultValue?: Immutable.List<DocR>): Immutable.List<DocR>
    set(key: 'docs', value: Immutable.List<DocR>): SearchRecordShape

    hasResults: boolean
    get(key: 'hasResults', defaultValue?: boolean): boolean
    set(key: 'hasResults', value: boolean): SearchRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): SearchRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): SearchRecordShape;
    remove(key: string): SearchRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): SearchRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: SearchRecordShape) => SearchRecordShape): SearchRecordShape;
    update(key: string, updater: (value: any) => any): SearchRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): SearchRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): SearchRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): SearchRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): SearchRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): SearchRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): SearchRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): SearchRecordShape;
    removeIn(keyPath: Array<any>): SearchRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): SearchRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): SearchRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): SearchRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): SearchRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): SearchRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): SearchRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: SearchRecordShape) => any): SearchRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): SearchRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): SearchRecordShape;

    toJS(): Search


}


/**
 * Default fields that must be provided in SearchRecord.
 */
export interface SearchRecordDefaults {
    query: string
    docs: Immutable.List<DocR>
    hasResults: boolean
}

/**
 * Typed SearchRecord constructor.
 */
export let SearchRecordCtor: RecordCtor<SearchRecordDefaults, SearchRecordShape> = Immutable.Record as any;

/**
 * Special method to parse SearchRecord with all the dependencies.
 */
export function parseSearchR(value: Search, deps: any): SearchRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'docs':
                return Immutable.List(value.map((item) => {
                    return deps.DocR.fromJS(item, deps);
                }));

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.SearchR(result);
}

export class SearchR extends SearchRecordCtor({
    query: null,
    docs: Immutable.List<DocR>(),
    hasResults: null,
}) {
    static fromJS(value: Search, deps: any): SearchR {
        return parseSearchR(value, deps)
    }
}

    

/**
* Map interface for App with specialized getters and setters.
*/

export interface AppRecordShape extends Immutable.Map<string, any> {

    $AppRecordShape: AppRecordShape

    navigation: NavigationR
    get(key: 'navigation', defaultValue?: NavigationR): NavigationR
    set(key: 'navigation', value: NavigationR): AppRecordShape

    search: SearchR
    get(key: 'search', defaultValue?: SearchR): SearchR
    set(key: 'search', value: SearchR): AppRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): AppRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): AppRecordShape;
    remove(key: string): AppRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): AppRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: AppRecordShape) => AppRecordShape): AppRecordShape;
    update(key: string, updater: (value: any) => any): AppRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): AppRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): AppRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): AppRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): AppRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): AppRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): AppRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): AppRecordShape;
    removeIn(keyPath: Array<any>): AppRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): AppRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): AppRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): AppRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): AppRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): AppRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): AppRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: AppRecordShape) => any): AppRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): AppRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): AppRecordShape;

    toJS(): App


}


/**
 * Default fields that must be provided in AppRecord.
 */
export interface AppRecordDefaults {
    navigation: NavigationR
    search: SearchR
}

/**
 * Typed AppRecord constructor.
 */
export let AppRecordCtor: RecordCtor<AppRecordDefaults, AppRecordShape> = Immutable.Record as any;

/**
 * Special method to parse AppRecord with all the dependencies.
 */
export function parseAppR(value: App, deps: any): AppRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'navigation':
                return deps.NavigationR.fromJS(value, deps);

            case key == 'search':
                return deps.SearchR.fromJS(value, deps);

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.AppR(result);
}

export class AppR extends AppRecordCtor({
    navigation: new NavigationR(),
    search: new SearchR(),
}) {
    static fromJS(value: App, deps: any): AppR {
        return parseAppR(value, deps)
    }
}

    

/**
* Map interface for Package with specialized getters and setters.
*/

export interface PackageRecordShape extends Immutable.Map<string, any> {

    $PackageRecordShape: PackageRecordShape

    info: DocPkgInfoR
    get(key: 'info', defaultValue?: DocPkgInfoR): DocPkgInfoR
    set(key: 'info', value: DocPkgInfoR): PackageRecordShape

    files: Immutable.Map<string, DocR>
    get(key: 'files', defaultValue?: Immutable.Map<string, DocR>): Immutable.Map<string, DocR>
    set(key: 'files', value: Immutable.Map<string, DocR>): PackageRecordShape

    fs: MemoryFileSystem
    get(key: 'fs', defaultValue?: MemoryFileSystem): MemoryFileSystem
    set(key: 'fs', value: MemoryFileSystem): PackageRecordShape


    get(key: string, defaultValue?: any): any;
    set(key: string, value: typeof undefined): PackageRecordShape;

    

    /**
     * Returns a new Map which excludes this `key`.
     *
     * Note: `delete` cannot be safely used in IE8, but is provided to mirror
     * the ES6 collection API.
     * @alias remove
     */
    delete(key: string): PackageRecordShape;
    remove(key: string): PackageRecordShape;

    /**
     * Returns a new Map containing no keys or values.
     */
    clear(): PackageRecordShape;

    /**
     * Returns a new Map having updated the value at this `key` with the return
     * value of calling `updater` with the existing value, or `notSetValue` if
     * the key was not set. If called with only a single argument, `updater` is
     * called with the Map itself.
     *
     * Equivalent to: `map.set(key, updater(map.get(key, notSetValue)))`.
     */
    update(updater: (value: PackageRecordShape) => PackageRecordShape): PackageRecordShape;
    update(key: string, updater: (value: any) => any): PackageRecordShape;
    update(key: string, notSetValue: any, updater: (value: any) => any): PackageRecordShape;

    /**
     * Returns a new Map resulting from merging the provided Iterables
     * (or JS objects) into this Map. In other words, this takes each entry of
     * each iterable and sets it on this Map.
     *
     * If any of the values provided to `merge` are not Immutable.Iterable (would return
     * false for `Immutable.isIterable`) then they are deeply converted via
     * `Immutable.fromJS` before being merged. However, if the value is an
     * Immutable.Iterable but includes non-iterable JS objects or arrays, those nested
     * values will be preserved.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.merge(y) // { a: 50, b: 40, c: 30, d: 60 }
     *     y.merge(x) // { b: 20, a: 10, d: 60, c: 30 }
     *
     */
    merge(...iterables: Immutable.Iterable<string, any>[]): PackageRecordShape;
    merge(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `merge()`, `mergeWith()` returns a new Map resulting from merging
     * the provided Iterables (or JS objects) into this Map, but uses the
     * `merger` function for dealing with conflicts.
     *
     *     var x = Immutable.Map({a: 10, b: 20, c: 30});
     *     var y = Immutable.Map({b: 40, a: 50, d: 60});
     *     x.mergeWith((prev, next) => prev / next, y) // { a: 0.2, b: 0.5, c: 30, d: 60 }
     *     y.mergeWith((prev, next) => prev / next, x) // { b: 2, a: 5, d: 60, c: 30 }
     *
     */
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * Like `merge()`, but when two Iterables conflict, it merges them as well,
     * recursing deeply through the nested data.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeep(y) // {a: { x: 2, y: 10 }, b: { x: 20, y: 5 }, c: { z: 3 } }
     *
     */
    mergeDeep(...iterables: Immutable.Iterable<string, any>[]): PackageRecordShape;
    mergeDeep(...iterables: { [key: string]: any }[]): Immutable.Map<string, any>;

    /**
     * Like `mergeDeep()`, but when two non-Iterables conflict, it uses the
     * `merger` function to determine the resulting value.
     *
     *     var x = Immutable.fromJS({a: { x: 10, y: 10 }, b: { x: 20, y: 50 } });
     *     var y = Immutable.fromJS({a: { x: 2 }, b: { y: 5 }, c: { z: 3 } });
     *     x.mergeDeepWith((prev, next) => prev / next, y)
     *     // {a: { x: 5, y: 10 }, b: { x: 20, y: 10 }, c: { z: 3 } }
     *
     */
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeDeepWith(
        merger: (previous?: any, next?: any, key?: string) => any,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Deep persistent changes

    /**
     * Returns a new Map having set `value` at this `keyPath`. If any keys in
     * `keyPath` do not exist, a new immutable Map will be created at that key.
     */
    setIn(keyPath: Array<any>, value: any): PackageRecordShape;
    setIn(KeyPath: Immutable.Iterable<any, any>, value: any): PackageRecordShape;

    /**
     * Returns a new Map having removed the value at this `keyPath`. If any keys
     * in `keyPath` do not exist, no change will occur.
     *
     * @alias removeIn
     */
    deleteIn(keyPath: Array<any>): PackageRecordShape;
    deleteIn(keyPath: Immutable.Iterable<any, any>): PackageRecordShape;
    removeIn(keyPath: Array<any>): PackageRecordShape;
    removeIn(keyPath: Immutable.Iterable<any, any>): PackageRecordShape;

    /**
     * Returns a new Map having applied the `updater` to the entry found at the
     * keyPath.
     *
     * If any keys in `keyPath` do not exist, new Immutable `Map`s will
     * be created at those keys. If the `keyPath` does not already contain a
     * value, the `updater` function will be called with `notSetValue`, if
     * provided, otherwise `undefined`.
     *
     *     var data = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data = data.updateIn(['a', 'b', 'c'], val => val * 2);
     *     // { a: { b: { c: 20 } } }
     *
     * If the `updater` function returns the same value it was called with, then
     * no change will occur. This is still true if `notSetValue` is provided.
     *
     *     var data1 = Immutable.fromJS({ a: { b: { c: 10 } } });
     *     data2 = data1.updateIn(['x', 'y', 'z'], 100, val => val);
     *     assert(data2 === data1);
     *
     */
    updateIn(
        keyPath: Array<any>,
        updater: (value: any) => any
    ): PackageRecordShape;
    updateIn(
        keyPath: Array<any>,
        notSetValue: any,
        updater: (value: any) => any
    ): PackageRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        updater: (value: any) => any
    ): PackageRecordShape;
    updateIn(
        keyPath: Immutable.Iterable<any, any>,
        notSetValue: any,
        updater: (value: any) => any
    ): PackageRecordShape;

    /**
     * A combination of `updateIn` and `merge`, returning a new Map, but
     * performing the merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.merge(y));
     *     x.mergeIn(['a', 'b', 'c'], y);
     *
     */
    mergeIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;

    /**
     * A combination of `updateIn` and `mergeDeep`, returning a new Map, but
     * performing the deep merge at a point arrived at by following the keyPath.
     * In other words, these two lines are equivalent:
     *
     *     x.updateIn(['a', 'b', 'c'], abc => abc.mergeDeep(y));
     *     x.mergeDeepIn(['a', 'b', 'c'], y);
     *
     */
    mergeDeepIn(
        keyPath: Immutable.Iterable<any, any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: Immutable.Iterable<string, any>[]
    ): PackageRecordShape;
    mergeDeepIn(
        keyPath: Array<any>,
        ...iterables: { [key: string]: any }[]
    ): Immutable.Map<string, any>;


    // Transient changes

    /**
     * Every time you call one of the above functions, a new immutable Map is
     * created. If a pure function calls a number of these to produce a final
     * return value, then a penalty on performance and memory has been paid by
     * creating all of the intermediate immutable Maps.
     *
     * If you need to apply a series of mutations to produce a new immutable
     * Map, `withMutations()` creates a temporary mutable copy of the Map which
     * can apply mutations in a highly performant manner. In fact, this is
     * exactly how complex mutations like `merge` are done.
     *
     * As an example, this results in the creation of 2, not 4, new Maps:
     *
     *     var map1 = Immutable.Map();
     *     var map2 = map1.withMutations(map => {
     *       map.set('a', 1).set('b', 2).set('c', 3);
     *     });
     *     assert(map1.size === 0);
     *     assert(map2.size === 3);
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     *
     */
    withMutations(mutator: (mutable: PackageRecordShape) => any): PackageRecordShape;

    /**
     * Another way to avoid creation of intermediate Immutable maps is to create
     * a mutable copy of this collection. Mutable copies *always* return `this`,
     * and thus shouldn't be used for equality. Your function should never return
     * a mutable copy of a collection, only use it internally to create a new
     * collection. If possible, use `withMutations` as it provides an easier to
     * use API.
     *
     * Note: if the collection is already mutable, `asMutable` returns itself.
     *
     * Note: Not all methods can be used on a mutable collection or within
     * `withMutations`! Only `set` and `merge` may be used mutatively.
     */
    asMutable(): PackageRecordShape;

    /**
     * The yin to `asMutable`'s yang. Because it applies to mutable collections,
     * this operation is *mutable* and returns itself. Once performed, the mutable
     * copy has become immutable and can be safely returned from a function.
     */
    asImmutable(): PackageRecordShape;

    toJS(): Package


}


/**
 * Default fields that must be provided in PackageRecord.
 */
export interface PackageRecordDefaults {
    info: DocPkgInfoR
    files: Immutable.Map<string, DocR>
    fs: MemoryFileSystem
}

/**
 * Typed PackageRecord constructor.
 */
export let PackageRecordCtor: RecordCtor<PackageRecordDefaults, PackageRecordShape> = Immutable.Record as any;

/**
 * Special method to parse PackageRecord with all the dependencies.
 */
export function parsePackageR(value: Package, deps: any): PackageRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'info':
                return deps.DocPkgInfoR.fromJS(value, deps);

            case key == 'files':
                let map = {};
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        map[key] = deps.DocR.fromJS(value[key], deps);
                    }
                }
                return Immutable.Map(map);

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.PackageR(result);
}

export class PackageR extends PackageRecordCtor({
    info: new DocPkgInfoR(),
    files: Immutable.Map<string, DocR>(),
    fs: null,
}) {
    static fromJS(value: Package, deps: any): PackageR {
        return parsePackageR(value, deps)
    }
}

export let allRecords = {
    PackageDefR,
    DocPkgInfoR,
    DocFileDefR,
    DocR,
    DocIndexR,
    NavigationR,
    SearchR,
    AppR,
    PackageR,
}
