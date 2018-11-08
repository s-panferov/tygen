# TyGen — TypeScript documentation generator

[![Gitter](https://badges.gitter.im/s-panferov/tygen.svg)](https://gitter.im/s-panferov/tygen?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/s-panferov/tygen.svg?branch=master)](https://travis-ci.org/s-panferov/tygen)

This project aims to create a full-featured modern TypeScript documentation generator with support of all the latest TypeScript features. It can build an interlinked representation of all project files, so every symbol of your program (and your dependencies) is inspectable, even those dependencies in `@types/*` packages.

Big goals:

1.  Full-featured static/dynamic TypeScript documentation generator.
2.  Special support for ReactJS/Angular/Vue projects.
3.  All-in-one documentation portal: [tsdoc.io](https://tsdoc.io)

## Donation request

This project has very ambitious goals, but demands a lot of attention and hard work to make things right. I need to invest tons of my free time and right now this project is supported solely by my enthusiasm.

We all know that maintaining an open source project is a HARD work. Enthusiasm burns out and does not last forever (especially after you get your first 100 bug reports without a proper description and reproduction steps), but money can motivate you for years. And this is why I ask you to consider a donation if you're interested me to continue this work.

<span class="badge-patreon"><a href="https://www.patreon.com/spanferov" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>

## Example output

Just visit [tsdoc.io](http://tsdoc.io) and search for a package you're interested in.

## Work in progress

This project is an active development phase, so please expect it to change rapidly and break often.

## Install

You can use `npm` or `yarn` to install `tygen`. This project consists of several different packages with different purposes:

-   Package `@tygen/reflector` contains code to reflect TypeScript internal program representation into a set of JSON reflections.
-   Package `@tygen/html` helps to pre-render JSON reflections into a static HTML or serve them as a web-server. This package written as a modern frontend application in ReactJS and server-side rendering.

```
yarn add --dev @tygen/reflector @tygen/html
```

## Use

`tygen` has several binaries to help you to generate/serve reflections and a documentation.

If you want all-in-one command to generate ready-to-serve static HTML documentation:

```
yarn exec -- tygen generate --project=. --out=docs --with=@tygen/html
```

First argument of the `tygen --project <source>` command should point to a folder with a `tsconfig.json` file. `tygen` will compile your project with TypeScript compiler and then generate reflections and HTML files.

Please take note:

1.  `tygen` can generate documentation only for well-typed projects (with no compilation errors).
2.  HTML compilation can take some time, `tygen` is not optimized for performance yet.

Result documentation can be served as static files with any capable web server or opened as `file://` resource in your browser.

## What is supported

TypeScript > 3.0 is supported. I _cannot_ guarantee backward compatibility at this stage, so expect this project to support only several most recent TypeScript versions.

## How to contribute

Right now the best way to contribute is to:

1.  Help to provide better and more comprehensive reflections in `@tygen/reflector` package.

2.  Propose a better UX/design, because current one is very basic.

3.  Help to deal with potential crashes.

4.  Help to write tests. This may potentially help to become backward-compatible in the future. This projects _does not_ have tests yet. This is an informed decision, I want to concentrate on functionality first.

# How to build

To run this stuff in development mode:

1. Run `yarn install`
1. Open _3_ different terminal tabs:
   1.1 Run `yarn exec server-watch`
   1.1 Run `yarn exec client-watch`
   1.1 Run `yarn exec tsc -- -b --watch`
1. Generate example reflections by running:

```
node ./packages/tygen-reflector/lib/cli.js reflect --project=examples/simple --out=docs --write-inventory
```

My vscode debugging configuration:

```json
{
	"name": "Reflect example",
	"type": "node",
	"request": "launch",
	"runtimeExecutable": "${workspaceRoot}/roarr.sh",
	"program": "${workspaceRoot}/packages/tygen-reflector/lib/cli.js",
	"args": [
		"reflect",
		"--project",
		"examples/simple",
		"--out",
		"docs",
		"--include-external",
		"--include-libs",
		"--enable-search",
		"--write-inventory"
	],
	"cwd": "${workspaceRoot}/",
	"runtimeArgs": ["--nolazy", "--stack_size=90000"],
	"sourceMaps": true,
	"protocol": "inspector",
	"stopOnEntry": false,
	"outputCapture": "std",
	"env": {
		"NODE_ENV": "development",
		"ROARR_LOG": "true"
	}
}
```
