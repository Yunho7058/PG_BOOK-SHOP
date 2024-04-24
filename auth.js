let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    let receivedJwt = req.headers['authorization'];
    let decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decoded;
  } catch (err) {
    //err 내용들
    console.log(err.name);
    console.log(err.message);
    //다음 로직 실행 안되게 처리하기
    return err;
  }
};

module.exports = ensureAuthorization;
