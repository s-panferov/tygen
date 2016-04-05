# docscript

[![Join the chat at https://gitter.im/docscript/docscript](https://badges.gitter.im/docscript/docscript.svg)](https://gitter.im/docscript/docscript?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/docscript/docscript.svg?branch=master)](https://travis-ci.org/docscript/docscript)

A documentation generator for TypeScript projects.

[See example](http://docscript.github.io/docscript/doc/)

DocScript is still in the early stages of development, so don't be surprised if
APIs change and things break. If something's not working properly,
file an issue or submit a pull request!

## Usage

```
npm i -g docscript
docscript generate --withoutSearch --deepForeign
```

## .docscript.json

To generate the doc you need to have `.docscript.json` at the root of your project.
Sample content:

```
{
    "package": "docscript"
}
```
