export default function equal<T>(obj1: T, obj2: T): boolean {
    if (Array.isArray(obj1)) {
        for (let i = 0; i < (obj1 as any).length; i++) {
            let val1 = obj1[i];
            let val2 = obj2[i];

            if (!equal(val1, val2)) {
                return false;
            }
        }
    } else if (typeof obj1 === 'object') {
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);

        if (!equal(keys1, keys2)) {
            return false;
        } else {
            for (let i = 0; i < keys1.length; i++) {
                let val1 = obj1[keys1[i]];
                let val2 = obj2[keys1[i]];

                if (!equal(val1, val2)) {
                    return false;
                }
            }
        }
    } else {
        return obj1 === obj2;
    }

    return true;
}
