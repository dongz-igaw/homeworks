# HomeWorksFramework

> IGAWorks 프론트엔드 공통 프레임워크

### 시작하며

##### Spec

- IE9+, FF, Chrome, Safari(Mac Platform), Opera
- 반응형 지원(320 ~ 1600)

### 기술문서

##### Javascript

 **OOP Structure**
 
  - 프레임워크 컴포넌트를 작성할 때 OOP 기반으로 작성합니다.
  - 헬퍼 로직 `ObjectHelper`와 데이터 컨테이너 `ObjectData` 그리고 메소드 구조를 정의하는 `ObjectMethod`로 구성됩니다.
  
  | 구조이름 | 설명 |
  |--------------------|--------------|--------------|
  | ObjectHelper | 프레임워크 단의 기본적으로 필요한 헬퍼도구를 제공합니다. 헬퍼 기술문서를 참고하세요. |
  | ObjectData | 프레임워크 컴포넌트 내부 지역데이터와 전역 공통데이터를 제공합니다. 기본 제공 데이터는 기술문서를 참고하세요.  |
  | ObjectMethod | 프레임워크 컴포넌트 OOP 표준 구조를 설계하도록 도와줍니다. 컴포넌트 생성방법은 기술문서를 참고하세요.  |

 **Component**
 
  - DOM 엘리먼트와 연동하여 프레임워크에서 제공하는 엘리먼트를 제공할 수 있습니다.
  - 이 문서에서는 이러한 기능을 `컴포넌트`로 정의합니다.
  - 아래는 프레임워크 컴포넌트 중 모달 팝업과 관련된 정의 로직입니다.
  ```javascript
  // 모달 관련 설정
  (function ($e) {
      this.bind('click', function (event) {
          event.preventDefault();
          $e.modal('toggle');
      });
  }).bind('modal');
  ```
 
 - 이는 [data-modal] 을 속성으로 갖는 엘리먼트 중 data-modal="false" 인 것을 제외하여,
 - 필터에 부합하는 엘리먼트를 클릭 시 클릭 한 엘리먼트의 data-pen에서 정의된 셀렉터를 모달로 띄웁니다.
 - 이 때 모달을 띄우는 함수는 {element}.modal이며 이는 아래와 같이 정의됩니다.
 
 ```javascript
 _ws.modal = new ObjectMethod('modal', {
      init: function (e) {
          this.data._visible = false;
          this.data.$helper.bind(this.data.o.w, 'resize', function () {
              e.css({
                  left: (this.data.o.w.width() - e.width()) / 2,
                  top: (this.data.o.w.height() - e.height()) / 2
              });
          });
      },
      method: {
          toggle: function (e) {
              if (this.data._visible == true) {
                  e.hide();
              } else {
                  e.show();
              }
              this.data._visible = !this.data._visible;
          }
      },
      template: {
          overlay: '<div class="{framework}-{id}"></div>'
      }
  });
 ```
 
 - 위 로직은 지금 당장은 이해하시기 난해할 것입니다.
 - 하지만 {element}.modal() 형태를 사용하는 것 자체가 `컴포넌트`입니다.
 - 컴포넌트를 정의하기 위해서는 `ObjectMethod()`를 사용합니다.

 ```javascript
 _ws.modal = new ObjectMethod({element_name}, {element_setting})
 ```
 
 - 위 코드에서 {element_name}에 해당하는 부분이 `컴포넌트 명`입니다.
 - 두번째 인수로 제공하는 {element_setting}은 `컴포넌트 구조`를 정의할 수 있습니다.

  | 인수 명         | 타입   | 설명                       |
  |-----------------|--------|----------------------------|
  | element_name    | string | 컴포넌트의 이름을 작성합니다. ex) modal |
  | element_setting | object | 컴포넌트의 구조를 작성합니다. |

----
