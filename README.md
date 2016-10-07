# HomeWorksFramework

[![Build Status](https://travis-ci.com/IGAWorksDev/HomeWorksFramework.svg?token=x98k8HzDc3zdfP6gvssV&branch=master)](https://travis-ci.com/IGAWorksDev/HomeWorksFramework)

![HomeWorks Framework](https://s3-ap-northeast-1.amazonaws.com/campaign.intelligence/static/resources/homeworks/homeworks.png)

> IGAWorks Front End-Side Framework.

## Getting Start

- [가이드라인 바로가기](http://campaignintelligence-dev.ap-northeast-1.elasticbeanstalk.com/Content/homeworks/homeworks/)
- 자세한 내용은 [HomeWorks WIKI](https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/index.html)를 이용해주시기 바랍니다.

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

- 파일 내에 래핑된 Docs 페이지 [`homeworks/index.html`](https://github.com/IGAWorksDev/HomeWorksFramework/blob/master/homeworks/index.html) 참고하여 주시기 바랍니다.

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
