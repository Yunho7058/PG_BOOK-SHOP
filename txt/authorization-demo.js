// 문윤호
let jwt = require('jsonwebtoken');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.listen(1234); // 의미있는 포트 번호 작성하기

app.get('/jwt', (req, res) => {
  /*const token = jwt.sign(
        { id: loginUser.id, email: loginUser.email },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '5m',
          issuer: 'yunho',
        }
      ); */
  let token = jwt.sign({ foo: 'bar' }, 'TestTest');
  res.cookie('jwt', token, {
    httpOnly: true,
  });
  res.send('토큰 발급 완료');
  console.log(token);
});
app.get('/jwt/decoded', (req, res) => {
  let receivedJwt = req.headers['authorization'];
  let decoded = jwt.verify(receivedJwt, 'TestTest');

  //유효기간 만료 예외처리

  res.send(decoded);
});

const tryCatchDemo = () => {
  try {
    username;
    // 일반적으로 여기서 err 발생하고 코드가 멈추지만 catch err 까지 내려가 뭐때문에 err 발생했는지 알려줌
  } catch (err) {
    console.log(err);
    // 위 코드가 무슨무슨 err 가 있는지 알려줌
  }
};

const throwErrDemo = () => {
  // err 객체 생성법
  new Error('대장에러 객체');
  new SyntaxError('구문 에러');
  new ReferenceError('대입 에러 발생');
};
