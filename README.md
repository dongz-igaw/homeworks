# HOMEWORKS FRAMEWORK

[![Build Status](https://travis-ci.com/IGAWorksDev/homeworks.svg?token=x98k8HzDc3zdfP6gvssV&branch=master)](https://travis-ci.com/IGAWorksDev/homeworks)
[![codecov](https://codecov.io/gh/IGAWorksDev/homeworks/branch/master/graph/badge.svg?token=viTgpBkL7A)](https://codecov.io/gh/IGAWorksDev/homeworks)

![HomeWorks Framework](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/homeworks_cover.png)

> IGAWorks Front End-Side Framework.

## Getting Started

- [가이드라인](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/index.html)
- [공식페이지](http://homeworks.igaworks.com/main/docs/index.html)

## Installation

### Git을 통한 설치

1. 작업하시는 프로젝트의 원하는 폴더에서 아래 명령줄을 실행합니다.

 ```shell
git clone git@github.com:IGAWorksDev/homeworks.git
cd homeworks
```

2. 프로젝트에서 Git을 사용하신다면 프로젝트 루트 폴더에서 서브 프로젝트로 지정합니다.

 ```shell
git submodule add git@github.com:IGAWorksDev/homeworks.git /path/of/homeworks
```

#### Release를 통한 설치

> [HOMEWORKS Release](https://github.com/IGAWorksDev/homeworks/releases)를 확인합니다.
>
> 원하는 파일을 zip파일로 다운받아 특정 폴더에 압축을 해제합니다.

#### 코드조각 삽입

- 개발하시는 웹 페이지 헤더에 아래 코드조각을 삽입해주세요.

```html
<script type="text/javascript" src="homeworks/dist/js/homeworks.min.js"></script>
<link type="text/css" href="homeworks/dist/css/homeworks.min.css" />
```

#### 데모페이지 확인

- 설치된 경로에서 아래 명령줄을 실행합니다.

```shell
npm install
npm start
```

----

### Update

- 설치된 경로에서 아래 명령줄을 실행합니다.

 ```shell
git pull origin master
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
 
 This project is using [JSDoc](http://usejsdoc.org/) for create doc files.
 
 You can decleare information of component by follow JSDoc rules.
 
### Flow

 ![Flow](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/flow.png)
 
 [설명참고](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/FLOW.html)
