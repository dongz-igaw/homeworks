# HomeWorksFramework

[![Build Status](https://travis-ci.com/IGAWorksDev/HomeWorksFramework.svg?token=rwDRrKxKFoGg8k5wwUnr&branch=master)](https://travis-ci.com/IGAWorksDev/HomeWorksFramework)

> IGAWorks 프론트엔드 공통 프레임워크

## Getting Start

## Javascript
##### ObjectData([prototype this], [string id])
 > 컴포넌트에서 참조하는 데이터 세트.
 > HomeWorks 내부에서 관리하는 프로토타입이므로 컴포넌트 정의 작업에서는 사용하지 않습니다.

##### ObjectHelper([prototype this])
 > 컴포넌트에서 참조하는 헬퍼 도구.
 > HomeWorks 내부에서 관리하는 프로토타입이므로 컴포넌트 정의 작업에서는 사용하지 않습니다.

##### ObjectMethod([string component names], [array options])
 > 컴포넌트 정의 함수.
 
###### 정의예시

```javascript
// component1, component2 각각의 이름의 컴포넌트를 정의.
_ws.modal = new ObjectMethod('component1, component2', {
  init: function (element, options) {
      var _this = this;
      // initializing
  },
  method: {
      subMethod1: function(element, options) {
      },
      subMethod2: function(element, options) {
      }
  },
  template: {
      template1: '',
      template2: ''
  },
  options: {
      options1: 'value',
      options2: {
       options2Dot1: 'value'
      }
  }
});
```

###### 사용예시
1. **Init 호출 형태**

 - **jQuery Style**

  ```javascript
  // 아래 예제는 component1의 init을 호출합니다.
  // this => ObjectMethod prototype
  // element => body
  // options => {
  //  debug: true
  // }
  var options = {
    debug: true
  };
  $('body').component1(options);
```

 - **Functional Style**

  ```javascript
  // 아래 예제는 component1의 init을 호출합니다.
  // this => ObjectMethod prototype
  // element => body
  // options => {
  //  debug: true
  // }
  var options = {
    debug: true
  };
  component1($('body'), options);
```

2. **Method 호출 형태**

 - **jQuery Naming Style**

  ```javascript
  // 아래 예제는 component1의 methods 중 subMethod1을 호출합니다.
  // this => ObjectMethod prototype
  // element => body
  // options => {
  //  debug: true
  // }
  var options = {
    debug: true
  };
  $('body').component1('subMethod1', options);
```

 - **jQuery Chaning Style**

  ```javascript
  // 아래 예제는 component1의 methods 중 subMethod1을 호출합니다.
  // this => ObjectMethod prototype
  // element => body
  // options => {
  //  debug: true
  // }
  var options = {
    debug: true
  };
  $('body').subMethod1(options);
```

----

## Style Guide

1. If / Else Pattern

 - DO:
 
 ```javascript
 if (condition) {
 } else {
 }
```

 - DON'T:

 ```javascript
 if(condition)
 {
 }
 else
 {
 }
```

 ```javascript
 if(condition) {
 }
 else {
 }
```

 ```javascript
 if(condition) {
 }else{
 }
```

2. addEventlistener Pattern

 - DO:
 
 ```javascript
 $(element).bind(event code, callback);
```

 - DON'T:
 
 ```javascript
 $(element).on(event code, callback);
```

 ```javascript
 $(element).live(event code, callback);
```

 ```javascript
 $(element).addEventlistener(event code, callback);
```

3. trigger Pattern

 - DO:

 ```javascript
 $(element).triggerHandler(event code);
```

 - DON'T:

 ```javascript
 $(element).trigger(event code);
```

4. class naming

 - DO:

 ```html
 <div class="content-inner-title"></div>
```
 
 - DON'T:
 
 ```html
 <div class="contentInnerTitle"></div>
```

 ```html
 <div class="content_inner_title"></div>
```
