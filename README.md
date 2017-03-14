# HOMEWORKS FRAMEWORK

[![Build Status](https://travis-ci.com/IGAWorksDev/homeworks.svg?token=x98k8HzDc3zdfP6gvssV&branch=master)](https://travis-ci.com/IGAWorksDev/homeworks)
[![Coverage Status](https://coveralls.io/repos/github/IGAWorksDev/homeworks/badge.svg?branch=master)](https://coveralls.io/github/IGAWorksDev/homeworks?branch=master)
[![codecov](https://codecov.io/gh/IGAWorksDev/homeworks/branch/master/graph/badge.svg?token=viTgpBkL7A)](https://codecov.io/gh/IGAWorksDev/homeworks)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

![HomeWorks Framework](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/homeworks_cover.png)

This project helps develop the front end in a modern and cool way.

Yes!, This project may look similar to the purpose of Bootstrap or Foundation framework.

But this project has a plan more than bigger than one fundamentally.

Support for angular directives and reactive components is also under development.

We hope you enjoy this project!

## Notice & Warnings

> This project is under development yet.
>
> Of course, There are many features available in the current version, And you can use it!
>
> But also as many issues can be found.
>
> If you get an error, please leave an issue [here](https://github.com/IGAWorksDev/homeworks/issues).

## Getting Started

- [Developer Docs (Korean)](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/index.html)
- [Official Site (Korean)](http://homeworks.igaworks.com/main/docs/index.html)

----

## Installation

### Install using Git

1. Type the following command on the directory that you want.

 ```bash
$ git clone git@github.com:IGAWorksDev/homeworks.git
$ cd homeworks
```

2. You can open `HOMEWORKS` page in your browser easily by typing code below.

 ```bash
$ npm install
$ npm start
```

3. If you want to use `HOMEWORKS` to submodule of Git, Type the command like below.

 ```bash
$ git submodule add git@github.com:IGAWorksDev/homeworks.git /path/of/homeworks
```

----

### Install from release zip file.

> Check [HOMEWORKS Release](https://github.com/IGAWorksDev/homeworks/releases)
>
> Download the file that you want, And unzip it.

#### Add html snippets.

- Add this spinnet in `head` tag of your html file.

```html
<script type="text/javascript" src="homeworks/dist/js/homeworks.min.js"></script>
<link type="text/css" href="homeworks/dist/css/homeworks.min.css" />
```

----

### Update

- Type this code on your current path of HOMEWORKS.

 ```shell
$ git pull origin master
```

----
 
## Structures

- [JAVASCRIPT](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/)

 ![Structure](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/Introduction.png)
 
- [STYLE](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/STYLE/)

 ![CSS Structure](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/css_structure.png)

----

```html
  ─┬ homeworks repository
   │
   ├─┬ src
   │　│ 
   │　├┬ js
   │　│└─ `homeworks.js`     <!-- Original script file. -->
   │　└┬ css
   │　　└─`homeworks.css`    <!-- Original style sheet file. -->
   │
   ├─┬ dist
   │　│ 
   │　├─ `homeworks.min.js`  <!-- Distributed script file. -->
   │　└─ `homeworks.min.css` <!-- Distributed style sheet file. -->
   │
   └─┬ vender
     │
     └┬ js
      └─ jquery-1.12.2.min.js
```

----

## [Deployment](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/DEPLOY.html)

![Deployment](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/deploy.png)

----

## Contribution

### Docs
 
> This project uses [JSDoc](http://usejsdoc.org/) to provide a reference document.
>
> If you will contribute in the component development,
>
> You can use the JSDoc comment rules to create a reference document.
 
### Flow

 ![Flow](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/flow.png)
 
 [Check this description](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/FLOW.html)
