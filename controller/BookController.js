// 문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
  const { categoryId } = req.query;
  if (categoryId) {
    return bookByCategory(req, res, categoryId);
  }
  conn.query(`SELECT * FROM books`, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
      //throw err;
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

const bookDetail = (req, res) => {
  const id = Number(req.params.id);

  conn.query(`SELECT * FROM books WHERE id=?`, id, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
      //throw err;
    }
    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

const bookByCategory = (req, res, categoryId) => {
  conn.query(
    `SELECT * FROM books WHERE category_id=?`,
    categoryId,
    (err, results) => {
      if (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
        //throw err;
      }
      if (results.length > 0) {
        return res.status(StatusCodes.OK).json(results);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    }
  );
};

module.exports = { allBooks, bookDetail };
