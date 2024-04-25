//문윤호
let jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();
const ensureAuthorization = require('../auth');

const likeAdd = (req, res) => {
  /*좋아요 눌렀을때
    1. 사용자가 아이디랑 북 아이디 보내줌
    2. 그걸 db 저장*/
  //const { userId } = req.body;
  const { likeBookId } = req.params.id;

  let authorization = ensureAuthorization(req, res);
  if (authorization instanceof jwt.TokenExpiredError) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '로그인이 만료되었습니다.' });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: '잘못된 토큰 입니다.' });
  } else {
    let userId = authorization.id;
    let sql = `INSERT INTO likes(user_id,liked_book_id) VALUES (?,?)`;
    const values = [userId, likeBookId];
    conn.query(sql, values, (err, resulst) => {
      if (err) {
        throw err;
      }
      // 만약 좋아요 테이블에 내가 좋아요 누름 테이블 있을경우
      res.status(StatusCodes.CREATED).json(resulst);
    });
  }
};
const likeRemove = (req, res) => {
  //const { userId } = req.body;
  const { likeBookId } = req.params.id;
  let authorization = ensureAuthorization(req, res);
  if (authorization instanceof jwt.TokenExpiredError) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '로그인이 만료되었습니다.' });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: '잘못된 토큰 입니다.' });
  } else {
    let userId = authorization.id;
    let sql = `DELETE FROM likes WHERE user_id=? AND liked_book_id=?`;
    const values = [userId, likeBookId];
    conn.query(sql, values, (err, resulst) => {
      if (err) {
        throw err;
      }
      // 만약 좋아요 테이블에 내가 좋아요 누름 테이블 있을경우
      res.status(StatusCodes.OK).json(resulst);
    });
  }

  c;
};

const ensureAuthorization = (req) => {
  let receivedJwt = req.headers['authorization'];
  let decoded = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  return decoded;
};

module.exports = { likeAdd, likeRemove };
