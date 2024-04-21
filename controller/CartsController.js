//문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();

const getAllItem = (req, res) => {
  const { userId, selected } = req.body;
  conn.query(
    `SELECT cartItems.id, book_id, title, summary, quantity, price 
    FROM cartItems LEFT JOIN books 
    ON cartItems.book_id = books.id;
    WHERE user_id=?  AND id IN (?)`,
    [userId, selected],
    (err, results) => {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).end();
        //throw err;
      }
      return res.status(StatusCodes.OK).json(results);
    }
  );
};
const addItem = (req, res) => {
  const { bookId, quntity, userId } = req.body;
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
};
const removeItem = (req, res) => {
  const { userId } = req.body;
  let sql = `DELETE FROM cartitems WHERE user_id=?`;
  conn.query(sql, userId, (err, resulst) => {
    if (err) {
      throw err;
    }
    res.status(StatusCodes.OK).json(resulst);
  });
};

module.exports = { getAllItem, addItem, removeItem };
