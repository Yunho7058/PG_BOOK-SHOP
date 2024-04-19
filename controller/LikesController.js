//문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();

const likeAdd = (req, res) => {
  /*좋아요 눌렀을때
    1. 사용자가 아이디랑 북 아이디 보내줌
    2. 그걸 db 저장*/
  const { userId } = req.body;
  const { likeBookId } = req.params.id;
  let sql = `INSERT INTO likes(user_id,liked_book_id) VALUES (?,?)`;
  const values = [userId, likeBookId];
  conn.query(sql, values, (err, resulst) => {
    if (err) {
      throw err;
    }
    // 만약 좋아요 테이블에 내가 좋아요 누름 테이블 있을경우
    res.status(StatusCodes.CREATED).json(resulst);
  });
};
const likeRemove = (req, res) => {
  const { userId } = req.body;
  const { likeBookId } = req.params.id;
  let sql = `DELETE FROM likes WHERE user_id=? AND liked_book_id=?`;
  const values = [userId, likeBookId];
  conn.query(sql, values, (err, resulst) => {
    if (err) {
      throw err;
    }
    // 만약 좋아요 테이블에 내가 좋아요 누름 테이블 있을경우
    res.status(StatusCodes.OK).json(resulst);
  });
};

module.exports = { likeAdd, likeRemove };
