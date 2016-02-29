export function omit<T>(obj: T, ...keys: string[]): T {
    let newObj = {} as any;

    let objKeys = Object.keys(obj);
    for (let i = 0; i < objKeys.length; i++) {
        let name = objKeys[i];
        if (keys.indexOf(name) === -1) {
            newObj[name] = obj[name];
        }
    }

    return newObj;
};

export function debounce<T extends Function>(func: T, wait: number): T {
    // we need to save these in the closure
    let timeout: any, args: any, context: any, timestamp: any;

    return function() {

        // save details of latest call
        context = this;
        args = [].slice.call(arguments, 0);
        timestamp = new Date();

        // this is where the magic happens
        let later = function() {

            // how long ago was the last call
            let last = +(new Date()) - timestamp;

            // if the latest call was less that the wait period ago
            // then we reset the timeout to wait for the difference
            if (last < wait) {
                timeout = setTimeout(later, wait - last);

                // or if not we can null out the timer and run the latest
            } else {
                timeout = null;
                func.apply(context, args);
            }
        };

        // we only need to set the timer now if one isn't already running
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    } as any;
};

export function simpleEqual<T>(obj1: T, obj2: T): boolean {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        for (let i = 0; i < (obj1 as any).length; i++) {
            let val1 = obj1[i];
            let val2 = obj2[i];

            if (!simpleEqual(val1, val2)) {
                return false;
            }
        }
    } else if (typeof obj1 === 'object' && !!obj1 && typeof obj2 === 'object' && !!obj2) {
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);

        if (!simpleEqual(keys1, keys2)) {
            return false;
        } else {
            for (let i = 0; i < keys1.length; i++) {
                let val1 = obj1[keys1[i]];
                let val2 = obj2[keys1[i]];

                if (!simpleEqual(val1, val2)) {
                    return false;
                }
            }
        }
    } else {
        return obj1 === obj2;
    }

    return true;
}
