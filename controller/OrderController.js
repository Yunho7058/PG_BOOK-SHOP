//문윤호
//const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();
const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
  });

  // firstBookTitle 클라언트야 요것도 추가로 보내줘
  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;

  //const delivery_id = SELECT max(id) FROM delivery; -> 이런식으로 하려고 했지만
  //resulet insertId 를 알려줌
  //!delivery 테이블 채우기
  let [result] = await conn.execute(sql, [
    delivery.address,
    delivery.receiver,
    delivery.contact,
  ]);
  const delivery_id = result.insertId;
  /* 
  INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
VALUES ("백설공주와 일곱남쟁이", 3, 60000, 1, delivery_id);
const order_id = SELECT max(id) FROM orders;*/

  //! orders 테이블 채우기
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, delivery_id,user_id) 
  VALUES (?, ?, ?, ?, ?);`;
  let value = [firstBookTitle, totalQuantity, totalPrice, delivery_id, userId];
  [result] = await conn.execute(sql, value);
  const order_id = result.insertId;

  // items 가지고 장바구니 조회 (아이디 삭제를위한 작업)
  // console.log(items);

  //sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  // let [rows,fields] = awaite conn.query()
  //let [orderItems, fields] = await conn.query(sql, [items]);

  // 벌크 인설트 2중 배열
  //! ordersbook 테이블 채우기 -> 최신문법이라 execute 실행 안됨 그래서 query 사용
  sql = 'INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;';
  let values = [];
  items.forEach((el) => {
    values.push([order_id, el.book_id, el.quantity]);
  });
  console.log(values, '여기2');
  [result] = await conn.query(sql, [values]);

  // 필터 함수 이용하여 아이템 아이디만 빼서 보내기
  result = deleteCartItems(conn, items);
  console.log(result);

  return res.status(StatusCodes.OK).json(result[0]);
};
const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  console.log(result);
  return result;
};

/*
// 장바구니 아이템 목록 조회
SELECT cartItems.id, book_id, title, summary, quantity, price 
FROM cartItems LEFT JOIN books 
ON cartItems.book_id = books.id;

// 장바구니 아이템 조회
DELETE FROM cartItems WHERE id = ?;
*/

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
  });
  let sql = `SELECT orders.id, book_title, total_quantity, total_price, address,receiver,contact FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id;`;
  let [result, fileds] = await conn.query(sql);
  return res.status(StatusCodes.OK).json(result);
};

const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
  });
  let sql = `SELECT book_id,title,author,price,quantity FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id=?`;
  let [result, fileds] = await conn.query(sql, [id]);
  return res.status(StatusCodes.OK).json(result);
};
module.exports = { order, getOrders, getOrderDetail };
