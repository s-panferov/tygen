import { IDoc, IDocRegistry, IDocPkgInfo } from 'awesome-typescript-loader/src/doc/doc';
import * as _ from 'lodash';

export interface IPkgMap {
    [key: string]: IPkg
}

export interface IPkg {
    info: IDocPkgInfo,
    files: { [key: string]: IDoc },
    docs: IDoc[],
}

function readPackages(registry: IDocRegistry): IPkgMap {
    let packages: IPkgMap = {};
    _.forEach(registry.files, (doc: IDoc) => {
        let pkg;
        if (!packages[doc.pkg.name]) {
            pkg = packages[doc.pkg.name] = <any>{ files: {}, docs: [] };
        } else {
            pkg = packages[doc.pkg.name];
        }

        pkg.info = doc.pkg;
        pkg.files[doc.fileInfo.relativeToPackage] = doc;
        pkg.docs.push(doc);
    });

    return packages;
}

export class Service {
    registry: IDocRegistry;
    packages: IPkgMap;

    constructor(registry: IDocRegistry) {
        this.registry = registry;
        this.packages = readPackages(registry);
    }

    getMainPackageName(): string {
        return this.registry.mainPackage;
    }

    getMainPackage(): IPkg {
        return this.packages[this.getMainPackageName()]
    }

    getPackage(pkgName: string) {
        return this.packages[pkgName];
    }

    getPackages(): IPkgMap {
        return this.packages;
    }
}