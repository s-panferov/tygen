import * as fs from 'fs';
import * as path from 'path';

interface Manifest {
    package: string;
}

export function resolveManifestSync(): Manifest {
    let manifest: Manifest;
    try {
        manifest = readManifestSync(path.join(process.cwd(), '.docscript.json'));
    } catch (e) {
        console.log(`You don't have a '.doscript.json' manifest file.`);
    }

    return manifest;
}

export function readManifestSync(manifest: string): Manifest {
    let file = fs.readFileSync(manifest).toString();
    return JSON.parse(file);
}
