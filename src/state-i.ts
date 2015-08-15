import * as Immutable from 'immutable';

import {
Navigation,
App,
} from './state';

export {
Navigation,
App,
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
export function parseNavigationRecord(value: Navigation, deps: any): NavigationRecordShape {
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

    return new deps.NavigationRecord(result);
}

export class NavigationRecord extends NavigationRecordCtor({
    pkg: null,
    path: null,
}) {
    static fromJS(value: Navigation, deps: any): NavigationRecord {
        return parseNavigationRecord(value, deps)
    }
}

    

/**
* Map interface for App with specialized getters and setters.
*/

export interface AppRecordShape extends Immutable.Map<string, any> {

    $AppRecordShape: AppRecordShape

    navigation: NavigationRecord
    get(key: 'navigation', defaultValue?: NavigationRecord): NavigationRecord
    set(key: 'navigation', value: NavigationRecord): AppRecordShape


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
    navigation: NavigationRecord
}

/**
 * Typed AppRecord constructor.
 */
export let AppRecordCtor: RecordCtor<AppRecordDefaults, AppRecordShape> = Immutable.Record as any;

/**
 * Special method to parse AppRecord with all the dependencies.
 */
export function parseAppRecord(value: App, deps: any): AppRecordShape {
    var recordWalker = function(value, key) {
        switch (true) {

            case key == 'navigation':
                return deps.NavigationRecord.fromJS(value, deps);

            default: return fromJSDefault(value);
        }
    };

    var result: any = {};
    for (var k in value) {
        if (value.hasOwnProperty) {
            result[k] = recordWalker(value[k], k);
        }
    }

    return new deps.AppRecord(result);
}

export class AppRecord extends AppRecordCtor({
    navigation: new NavigationRecord(),
}) {
    static fromJS(value: App, deps: any): AppRecord {
        return parseAppRecord(value, deps)
    }
}

export let allRecords = {
    NavigationRecord,
    AppRecord,
}
