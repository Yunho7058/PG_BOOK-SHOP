//문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
const { json } = require('express');
const ensureAuthorization = require('../auth');
dotenv.config();

const getAllItem = (req, res) => {
  const { selected } = req.body;
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
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
    FROM cartItems LEFT JOIN books 
    ON cartItems.book_id = books.id;
    WHERE user_id=?`;
    let userId = authorization.id;
    let values = [userId];
    if (selected) {
      // 선택한 장바구니 보기
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }
    conn.query(sql, values, (err, results) => {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).end();
        //throw err;
      }
      return res.status(StatusCodes.OK).json(results);
    });
  }
};
const addItem = (req, res) => {
  const { bookId, quntity } = req.body;
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
    conn.query(
      `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`,
      [bookId, quntity, userId],
      (err, results) => {
        if (err) {
          res.status(StatusCodes.BAD_REQUEST).end();
          //throw err;
        }
        return res.status(StatusCodes.OK).json(results);
      }
    );
  }
};

const removeItem = (req, res) => {
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
    let sql = `DELETE FROM cartitems WHERE user_id=?`;
    conn.query(sql, userId, (err, resulst) => {
      if (err) {
        throw err;
      }
      res.status(StatusCodes.OK).json(resulst);
    });
  }
};

module.exports = { getAllItem, addItem, removeItem };
