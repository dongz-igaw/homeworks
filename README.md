# HomeWorksFramework

[![Build Status](https://travis-ci.com/IGAWorksDev/homeworks.svg?token=x98k8HzDc3zdfP6gvssV&branch=master)](https://travis-ci.com/IGAWorksDev/homeworks)

![HomeWorks Framework](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/homeworks.png)

> IGAWorks Front End-Side Framework.

## Getting Started

- [가이드라인](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/index.html)
- [공식페이지](http://homeworks.igaworks.com/main/docs/index.html)

## Structures

- [JAVASCRIPT](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/)

 ![Structure](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/Introduction.png)
 
- [STYLE](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/STYLE/)

 ![CSS Structure](https://s3.ap-northeast-2.amazonaws.com/homeworks.igaworks.com/main/src/images/css_structure.png)

## Note

- 설치 가이드가 아직 가이드문서에 포함되지 않아 이곳에 간략히 정리합니다.
```html
  <!-- HomeWorks에서는 jQuery 라이브러리를 요구합니다. 1.11.1 이상으로 불러와주시기 바랍니다. -->
  <script src="vender/js/jquery-1.12.2.min.js"></script>
  

  <!-- 아래 두가지 파일이 HomeWorks에서 사용되는 최소 파일입니다. -->
  <script src="dist/homeworks.min.js"></script>
  <link rel="stylesheet" type="text/css" href="dist/homeworks.min.css" />
```

----

- Docs 페이지 [`homeworks/index.html`](http://homeworks.igaworks.com/main/docs/index.html) 참고하여 주시기 바랍니다.

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
