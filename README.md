# TypeScript documentation generator [beta]

[![Gitter](https://badges.gitter.im/s-panferov/tygen.svg)](https://gitter.im/s-panferov/tygen?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=s.panferov&url=https://github.com/s-panferov/tygen&title=TyGen&language=TypeScript&tags=github&category=software)

## Currently the project is WIP, expect it to be completely broken!! A working version expected to be ready soon.

This project aims to create a full-featured modern TypeScript documentation generator with support of all the latest TypeScript features. It can build interlinked representation of all project files, so every symbol of your program (and your dependencies) is inspectable, even those dependencies in `@types/*` packages.

Big goals:

1.  Full-featured static/dynamic TypeScript documentation generator. **<<-- we are here right now**
2.  Special support for ReactJS/Angular/Vue projects.
3.  All-in-one documentation portal like Rust's [docs.rs](docs.rs), but this will be possible **only** if you support me.

## Install

You can use `npm` or `yarn` to install `tygen`. This project consists of several different packages with different purposes:

*   Package `@tygen/reflector` contains code to reflect TypeScript internal program representation into a set of JSON reflections.
*   Package `@tygen/html` helps to pre-render JSON reflections into a static HTML or serve them as a web-server. This package written as a modern frontend application in ReactJS and server-side rendering.

```
yarn add --dev @tygen/reflector @tygen/html
```

## Use

`tygen` has several binaries to help you to generate/serve reflections and a documentation.

If you want all-in-one command to generate ready-to-serve static HTML documentation:

```
yarn exec -- tygen generate . --out docs --with @tygen/html
```

First argument of the `tygen <source>` command should point to a folder with a `tsconfig.json` file. `tygen` will compile your project with TypeScript compiler and then generate reflections and HTML files.

Please take note:

1.  `tygen` can generate documentation only for well-typed projects (with no compilation errors).
2.  HTML compilation can take some time, `tygen` is not optimized for performance yet.

Result documentation can be served as static files with any capable web server or opened as `file://` resource in your browser.

## What is supported

TypeScript > 2.8.3 is supported. I _cannot_ guarantee backward compatibility at this stage, so expect this project to support only several most recent TypeScript versions.

## How to contribute

Right now the best way to contribute is to:

1.  Help to provide better and more comprehensive reflections in `@tygen/reflector` package.

2.  Propose a better UX/design, because current one is very basic.

3.  Help to deal with potential crashes.

4.  Help to write tests. This may potentially help to become backward-compatible in the future. This projects _does not_ have tests yet. This is an informed decision, I want to concentrate on functionality first.

To run this stuff in development mode:

1.  Run `yarn install`
1.  Run `yarn start` in the root. This will build and start `@tygen/html` server to serve from `docs` folder.
1.  Run `yarn exec tsc` in the root in the separate shell tab.
1.  Generate self-reflections by running `node lib/tygen-reflector/src/cli.js . --out docs` in the root.

My vscode debugging configuration:

```json
{
	"name": "Generate",
	"type": "node",
	"request": "launch",
	"program": "${workspaceRoot}/lib/tygen-reflector/src/cli.js",
	"stopOnEntry": false,
	"args": ["generate", ".", "--out", "docs", "--with", "@tygen/html"],
	"cwd": "${workspaceRoot}/",
	"runtimeExecutable": "node",
	"runtimeArgs": ["--nolazy", "--stack_size=90000" /*, "-r", "module-alias/register" */],
	"sourceMaps": true,
	"env": { "NODE_ENV": "development" }
}
```
