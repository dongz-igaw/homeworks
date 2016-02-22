# HomeWorksFramework

[![Build Status](https://travis-ci.com/IGAWorksDev/HomeWorksFramework.svg?token=rwDRrKxKFoGg8k5wwUnr&branch=master)](https://travis-ci.com/IGAWorksDev/HomeWorksFramework)

> IGAWorks 프론트엔드 공통 프레임워크

### Javascript

#### ObjectMethod
#### ObjectHelper
#### ObjectData

----

### Style guide

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
