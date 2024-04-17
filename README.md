# PG_BOOK-SHOP

#### 각폴더/txt폴더 날짜별.txt 배운내용 간략히 작성 하였습니다.

## 7주차 5파트 학습내용(0412)
1. 유저 API 로직 작성
### txt 내용

#### 카데고리 조인해서 클라이언트에 보내주기
  1. db 포링키 연결
  2. SELECT * FROM books LEFT JOIN category ON books.category_id = category.id; 
  3. category 테이블 name 을 category_name 변경후 클라이언트 보기 편하게 보내주기
  4. 스키마 설계 꾸준히 수정하기

#### db 시간 범위 구현하기
  1. 시간 더하기 DATE_ADD(기준날짜,INTERVAL xxx)
  2. 시간 뺴기 DATE_SUB(기준날짜,INTERVAL xxx)

##### ex) sql문
  SELECT DATE_ADD("2024-04-10",INTERVAL 1 MONTH) -> 원하는 날짜 <br/>
  SELECT DATE_ADD(NOW(),INTERVAL 1 MONTH) -> 지금 날짜 <br/>
  SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 6 MONTH) AND NOW() <br/>
  (북 테이블에 있는 [펍 데이 조건은 범위지정을위해(BETWEEN) 오늘부터 한달 날짜] 데이터를 뽑아줘 )

#### 데이터베이스 페이징(paging)
  -. 모든 데이터를 한번에 보내기에는 부담이 될수 있기때문에 일정수량만 보내주기(클라이어단에서는 무한스크롤 구현 가능) <br/>
    SELECT * FROM books LIMT X OFFSET Y -> x=1,y=5 일때 <br/>
    LIMT -> 출력할 행의 수 <br/>
    OFFSET ->  시작지점(= 현제 페이지, 사용자가 누를는 페이지 <1,2,3,4,5>) <br/>
    ex) <br/>
    LIMT         : 3 <br/>
    CURRENTPAGE  : 1,2,3 ... <br/>
    OFFSET       : 0,3,6 .... <br/>

#### 코드 작성
  1. BookController.js 전체도서 조회, 카데고리조회, 신간 API 하나의 로직으로 통합

## 7주차 4파트 학습내용(0411)
1. 유저 API 로직 작성
### txt 내용

#### 도서 API
  1. Book Table 생성 후 data 삽입 (db 컬럼 변경 약어 사용금지 충돌방지, 약어는 대도록이면 사용하지 않기)
  2. 카테고리별 목록 조회 쿼리 스트링 이용

#### 코드 작성
  BookController.js
  1. 전체 도서 조회, 개별 조회
  2. 카테고리 조회 로직 전체 도서 조회 로직 병합
  3. 쿼리문 유무에 따른 도서 전체조회와 카테고리 조회 나누어 로직 발동되게 구현

  CategotyController.js 
  1. 카테고리 테이블 생성
  2. 클라이언트 에게 보내줄때 카테고리 아이디 말고 이름으로 보내주기


#### 현재까지 코드 작성하면서 문제점
  현재 코드는 라우터에 로직이 작성되어있어 나중에 코드가 많아 질수록 가독성 떨어지고 트러블 슈팅 어려워지고 유지보수 또한 떨어진다.
  (ex. routes/users.js 안에 api 로직이 다 작성되어있다.)-> 이를 해결하기위해 로직은 쪼개서 관리하는게 좋음 이를 구조화하고 한다.
    
 구보화 방법(해결방법)
  1. 콜백함수를 빼서 작성하자 -> 컨트롤러 파일을 만들어 관리하기 (라우터를 통해 들어오는 요청을 컨트롤러가 처리 )
  2. routes 는 길을 찾는 역할만 맡기기
  3. 로직일(콜백함수)은 컨트롤러가 처리하기

#### 비밀번호 암호화
  salt 암호화키를 이용해 사용자가 입력한 비밀번호를 salt 암호화 키를 이용해 hashPwd 비밀번호를 암호화 시키고
  DB에 암호화키(salt)와 암호화된 비밀번호(hashPwd) 저장
  로그인시 사용자가 입력한 비밀번호를 암호화할때 db 저장되어있던 암호화키를 가져와 사용자가 방금 입력한
  비밀번호를 암호화 시키고 db 에 저장된 암호화된 비밀번호와 비교하여 로그인 진행

## 7주차 3파트 학습내용(0410)
1. 유저 API 로직 작성
### txt 내용
#### 코드 작성 
  1. mariadb.js : db연동
  2. user.js 회원가입
        status code를 관리하기 위해 -> npm install http-status-codes --save
        : status code 200,400 다른이들이 봣을때 정확히 무슨 뜻인지 알수가 없기 때문에 한눈에 알아 볼 수 있게 표시
  3. 코드 구조화 controller 폴더 만들어 UserController.js 생성후 API 로직 작성
  4. UserController.js -> 로그인,회원가입,비밀번호초기화
    (주기적으로 설계 API 변경)

#### 현재까지 코드 작성하면서 문제점
  현재 코드는 라우터에 로직이 작성되어있어 나중에 코드가 많아 질수록 가독성 떨어지고 트러블 슈팅 어려워지고 유지보수 또한 떨어진다.
  (ex. routes/users.js 안에 api 로직이 다 작성되어있다.)-> 이를 해결하기위해 로직은 쪼개서 관리하는게 좋음 이를 구조화하고 한다.
    
 구보화 방법(해결방법)
  1. 콜백함수를 빼서 작성하자 -> 컨트롤러 파일을 만들어 관리하기 (라우터를 통해 들어오는 요청을 컨트롤러가 처리 )
  2. routes 는 길을 찾는 역할만 맡기기
  3. 로직일(콜백함수)은 컨트롤러가 처리하기

#### 비밀번호 암호화
  salt 암호화키를 이용해 사용자가 입력한 비밀번호를 salt 암호화 키를 이용해 hashPwd 비밀번호를 암호화 시키고
  DB에 암호화키(salt)와 암호화된 비밀번호(hashPwd) 저장
  로그인시 사용자가 입력한 비밀번호를 암호화할때 db 저장되어있던 암호화키를 가져와 사용자가 방금 입력한
  비밀번호를 암호화 시키고 db 에 저장된 암호화된 비밀번호와 비교하여 로그인 진행


## 7주차 2파트 학습내용(0409)
  1. 초기 세팅
  2. 각 파일 모듈화 (users.js, carts.js, oreders.js, likes.js, books.js)
  3. DB 생성후 users Table 생성

### txt 내용
#### Express base 구조
  1. Bin 폴더 -> www -> 포트 번화 등과 같은 웹 서버를 구축하는데 필요한 설정 데이터가 정의되어있는 파일
      -> .env 파일과 같은 설정 값을 가지고 에러처리 기타 추가 설정을 해주는 파일
  2. node_moduls : Node.js, Express 에 필요한 모듈들이 설치되어있는 폴더
  3. Public: 정적 파일, 프론트에서 보여주는 데이터를 정리한 폴더
  4. Routes: 각 경로를 담당하는 모듈들이 담아있는 폴더 (라우팅 모듈을 구현하는 모듈들)
  5. Views:  클라이언트에게 html 코드로 화면을 보내는 파일
  6. app.js: express 시작점 
  7. Packge.json: 이 프로젝트에 설치된 파일, 모듈, 버전 등등 정보를 확인할수 있는 파일

#### 프로젝트 초기 설정
  1. npm i express 
  2. npm i dotenv : 개발환경 설정 파일
  3. npm i express-validator : 유효성 검사
  4. npm i jsonwebtoken : jwt 토큰
  5. npm i mysql2 : db sql문

#### 코드 작성
  1. app.js 초기설정 및 routing 연결
  2. .env 개발환결 설정 
  3. routes 폴더 생성후 users.js, oreders.js, likes.js, carts.js, books.js 파일 생성
  4. 각 파일 API 기초 코드 작성 -> 서버 연결되는지 확인완료, postman 확인완료
  5. 각 필요한 파일 모듈화 진행후 app.js 연결
  6. BOOK-SHOP 스키마 생성 후 users table 생성









