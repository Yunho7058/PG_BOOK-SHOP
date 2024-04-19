// 문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
  const { categoryId, newBook, limt, currentPage } = req.query;
  let offset = limt * (currentPage - 1);
  // SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books
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
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

const bookDetail = (req, res) => {
  const id = Number(req.params.id);
  const { bookId } = req.body;
  // SELECT EXISTS (SLEECT * FROM likes WHERE user_id=? AND liked_book_id=?) AS liked -> 사용자가 좋아요 했나?
  // (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes -> 좋아요 갯수
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
};

module.exports = { allBooks, bookDetail };
