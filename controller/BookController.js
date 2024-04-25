// 문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth');

const allBooks = (req, res) => {
  const { categoryId, newBook, limt, currentPage } = req.query;
  let allBookRes = {};

  let offset = limt * (currentPage - 1);
  let sql = `SELECT * ,(SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books LEFT JOIN category ON books.category_id = category.id `;
  let value = [Number(limt), offset]; // sql 넘겨줘야할 변수 많을경우 배열에 담아서 보내주기
  if (categoryId && newBook) {
    sql += `WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 6 MONTH) AND NOW()`;
  } else if (categoryId) {
    sql += `WHERE category_id=?`;
    value = [categoryId, ...value];
  } else if (newBook) {
    sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 6 MONTH) AND NOW()`;
  }
  sql += 'LIMIT ? OFFSET ?';
  conn.query(sql, value, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
      //throw err;
    }
    if (results.length > 0) {
      results.map((el) => {
        el.putDate = el.pub_date;
        delete el.pub_date;
      });
      allBookRes = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = 'SELECT found_rows()';
  conn.query(sql, (err, result) => {
    if (err) {
    }
    let pagination = {};
    pagination.cur = Number(currentPage);
    pagination.total = result[0]['found_rows()'];
    allBookRes.pagination = pagination;
    return res.status(StatusCodes.OK).json(allBookRes);
  });
};

const bookDetail = (req, res) => {
  const { bookId } = req.body;
  let authorization = ensureAuthorization(req, res);
  if (authorization instanceof jwt.TokenExpiredError) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '로그인이 만료되었습니다.' });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: '잘못된 토큰 입니다.' });
  } else if (authorization instanceof ReferenceError) {
    conn.query(
      `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_book_id=books.id) 
      AS likes,
      FROM books LEFT JOIN category ON books.category_id = category.category_id 
      WHERE books.id=?;`,
      [bookId],
      (err, results) => {
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).end();
          //throw err;
        }
        if (results[0]) {
          return res.status(StatusCodes.OK).json(results[0]);
        } else {
          return res.status(StatusCodes.NOT_FOUND).end();
        }
      }
    );
  } else {
    let id = authorization.id;
    conn.query(
      `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_book_id=books.id) 
      AS likes,
      SELECT EXISTS (SLEECT * FROM likes WHERE user_id=? AND liked_book_id=?) 
      AS liked, 
      FROM books LEFT JOIN category ON books.category_id = category.category_id 
      WHERE books.id=?;`,
      [id, bookId, bookId],
      (err, results) => {
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).end();
          //throw err;
        }
        if (results[0]) {
          return res.status(StatusCodes.OK).json(results[0]);
        } else {
          return res.status(StatusCodes.NOT_FOUND).end();
        }
      }
    );
  }

  // SELECT EXISTS (SLEECT * FROM likes WHERE user_id=? AND liked_book_id=?) AS liked -> 사용자가 좋아요 했나?
  // (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes -> 좋아요 갯수
};

module.exports = { allBooks, bookDetail };
