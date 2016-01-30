import * as path from 'path';

export function filePath(file: string) {
    return path.join(process.cwd(), 'src', 'doc', 'tests', 'files', file);
}
