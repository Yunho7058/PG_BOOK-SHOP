//문윤호
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();

// INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);

const order = (req, res) => {
  // firstBookTitle 클라언트야 요것도 추가로 보내줘
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  let delivery_id;
  let order_id;
  //const delivery_id = SELECT max(id) FROM delivery; -> 이런식으로 하려고 했지만
  //resulet insertId 를 알려줌
  conn.query(
    sql,
    [delivery.address, delivery.receiver, delivery.userId],
    (err, results) => {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).end();
        //throw err;
      }
      //node와 db 서로 insert한 아이디를 알려줌 개꿀
      delivery_id = results.insertId;
      return res.status(StatusCodes.OK).json(results);
    }
  );

  /* 
  INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
VALUES ("백설공주와 일곱남쟁이", 3, 60000, 1, delivery_id);
const order_id = SELECT max(id) FROM orders;*/
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
  VALUES (?, ?, ?, ?, ?);`;
  let value = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
  conn.query(sql, value, (err, results) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).end();
      //throw err;
    }
    //node와 db 서로 insert한 아이디를 알려줌 개꿀
    order_id = results.insertId;
    return res.status(StatusCodes.OK).json(results);
  });
  // 벌크 인설트 2중 배열
  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (?, ?, ?);`;
  let values = [];
  items.forEach((el) => {
    values.push([order_id, el.book_id, el, quantity]);
  });
  conn.query(sql, [value], (err, results) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).end();
      //throw err;
    }
    return res.status(StatusCodes.OK).json(results);
  });
};
const getOrders = (req, res) => {};

const getOrderDetail = (req, res) => {};
module.exports = { order, getOrders, getOrderDetail };
