# TypeScript documentation generator

[![Gitter](https://badges.gitter.im/s-panferov/tygen.svg)](https://gitter.im/s-panferov/tygen?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=s.panferov&url=https://github.com/s-panferov/tygen&title=TyGen&language=TypeScript&tags=github&category=software)

This project aims to create a full-featured modern TypeScript documentation generator with support of all the latest TypeScript features. It can build interlinked representation of all project files, so every symbol of your program (and your dependencies) is inspectable, even those dependencies in `@types/*` packages.

Next big goal is to create an all-in-one documentation portal like Rust's [docs.rs](docs.rs), but this project will be possible **only** with your support.

## Install

You can use `npm` or `yarn` to install `tygen`. This project consists of several different packages with different purposes:

* Package `@tygen/reflector` contains code to reflect TypeScript internal program representation into a set of JSON reflections.
* Package `@tygen/html` helps to pre-render JSON reflections into a static HTML or serve them as a web-server. This package written as a modern frontend application in ReactJS and server-side rendering.

```
yarn add --dev @tygen/reflector @tygen/html
```

## Use

`tygen` has serveral binaries to help you to generate/serve reflections and a documentation. 

If you want all-in-one command to generate ready-to-serve static HTML documentation:

```
tygen . --out docs --with @tygen/html
```

First argument of the `tygen <source>` command should point to a folder with a `tsconfig.json` file. `tygen` will compile your project with TypeScript compiler and then generate reflections and HTML files. 

Please take note:

1) `tygen` can generate documentation only for well-typed projects (with no compilation errors).
2) HTML compilation can take some time, `tygen` is not optimized for performance yet.

Result documentation can be served as static files with any capable web server or opened as `file://` resource in your browser.
