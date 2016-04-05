import * as fs from 'fs';
import * as path from 'path';

interface Manifest {
    package: string;
}

export function resolveManifestSync() {
    let manifest = readManifestSync(path.join(process.cwd(), '.docscript.json'));
    return manifest;
}

export function readManifestSync(manifest: string): Manifest {
    let file = fs.readFileSync(manifest).toString();
    return JSON.parse(file);
}
