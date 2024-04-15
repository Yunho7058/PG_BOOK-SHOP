# PG_BOOK-SHOP

#### 각폴더/txt폴더 날짜별.txt 배운내용 간략히 작성 하였습니다.

### 7주차 2파트 학습내용(0409)
  1. 초기 세팅
  2. 각 파일 모듈화 (users.js, carts.js, oreders.js, likes.js, books.js)
  3. DB 생성후 users Table 생성


Express base 구조
  1. Bin 폴더 -> www -> 포트 번화 등과 같은 웹 서버를 구축하는데 필요한 설정 데이터가 정의되어있는 파일
      -> .env 파일과 같은 설정 값을 가지고 에러처리 기타 추가 설정을 해주는 파일
  2. node_moduls : Node.js, Express 에 필요한 모듈들이 설치되어있는 폴더
  3. Public: 정적 파일, 프론트에서 보여주는 데이터를 정리한 폴더
  4. Routes: 각 경로를 담당하는 모듈들이 담아있는 폴더 (라우팅 모듈을 구현하는 모듈들)
  5. Views:  클라이언트에게 html 코드로 화면을 보내는 파일
  6. app.js: express 시작점 
  7. Packge.json: 이 프로젝트에 설치된 파일, 모듈, 버전 등등 정보를 확인할수 있는 파일

프로젝트 초기 설정
  1. npm i express 
  2. npm i dotenv : 개발환경 설정 파일
  3. npm i express-validator : 유효성 검사
  4. npm i jsonwebtoken : jwt 토큰
  5. npm i mysql2 : db sql문

코드 작성
  1. app.js 초기설정 및 routing 연결
  2. .env 개발환결 설정 
  3. routes 폴더 생성후 users.js, oreders.js, likes.js, carts.js, books.js 파일 생성
  4. 각 파일 API 기초 코드 작성 -> 서버 연결되는지 확인완료, postman 확인완료
  5. 각 필요한 파일 모듈화 진행후 app.js 연결
  6. BOOK-SHOP 스키마 생성 후 users table 생성









