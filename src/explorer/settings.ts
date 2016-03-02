
export interface Settings {
    contextRoot: string;
    assetsRoot: string;
    docRoot: string;
}

export function defaultSettings(contextRoot?: string): Settings {
    contextRoot = contextRoot || window.location.pathname;
    contextRoot = contextRoot == '/' ? '' : contextRoot;
    let docRoot = `${contextRoot}/generated`;
    let assetsRoot = `${contextRoot}/assets`;

    return {
        contextRoot,
        assetsRoot,
        docRoot,
    };
}
