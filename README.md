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

 **공통변수**
 
 | 변수 명    | 설명 |
 |------------|------|
 | `_ws`      | _ws는 프레임워크의 최상위 공용변수입니다. 해당 변수에는 각 컴포넌트의 `ObjectMethod`를 관리합니다. |

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
  
- {element_setting}은 프레임워크에서 정의한 표준형태를 따라야 합니다.
 
  | 프로퍼티 | 타입 | 설명 |
  |----------|------|------|
  | init     | function | `{element}.modal() 혹은 {element}.modal(setting) 형태의 호출에 대한 콜백함수 |
  | method   | object(function) | method 내에 자식요소로 key:function타입 선언 시 {element}.{key}() 호출 시 {function}이 호출 |
  | template | object{string} | key:value 타입이며 init, 혹은 method에서 해당 템플릿을 파서를 통해 참조 가능 |

- 컴포넌트를 정의하기 위해 사용한 `ObjectMethod`의 표준규격은 아래와 같습니다.

  | 프로퍼티 | 타입 | 설명 |
  |----------|------|------|
  | route   | function | {element}.{component_name}을 호출 시 route를 통해 `init`과 `method` 분기합니다. |
 
- 컴포넌트 데이터를 관리하는 `ObjectData`의 기본 공통데이터는 아래와 같습니다.
 
  | 키 | 타입 | 설명 |
  |----|------|------|
  | $super | prototype | `ObjectData` 자신을 가리키고 있는 변수입니다. |
  | $helper | prototype | `ObjectHelper`를 가리키고 있는 변수입니다. |
  | _bind | boolean | 컴포넌트 등록단계인 $.fn이 등록되었는지 체크하는 상태변수 입니다. |
  | _debug | boolean | 프레임워크가 디버그 상태인지 체크할 수 있는 상태변수 입니다. |
  | _init | boolean | 컴포넌트를 한번이상 실행 시켰는지 체크하는 상태변수 입니다. |
  | framework | string | 프레임워크의 identity를 가지는 문자열입니다. |
  | id | string | 컴포넌트를 구분 지을 수 있는 컴포넌트 identity 문자열입니다. |
  | o | object | 전역 DOM을 빠르게 접근하기 위한 정의입니다. |

- `ObjectData`에 정의하는 `Key`는 작성규약이 있습니다.

  | prefix | 타입 | 설명 |
  |--------|------|------|
  | $      | 참조 | prototype, function 타입을 참고하기 위한 참조변수 입니다. |
  | _      | boolean | 상태를 확인하기 위한 boolean 타입의 상태변수 입니다. |
  | .      | number | 컴포넌트의 각종 수치를 관리하는 number 타입의 수치변수 입니다. |
  |        | all types | 프리픽스 지정이 없는 것은 위의 항목에 해당하지 않는 모든 변수에 해당합니다.

----
