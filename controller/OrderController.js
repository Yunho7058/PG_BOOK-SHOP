//문윤호
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');
let jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth');

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
  const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
    req.body;
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;

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

    //!delivery 테이블 채우기
    let [result] = await conn.execute(sql, [
      delivery.address,
      delivery.receiver,
      delivery.contact,
    ]);
    const delivery_id = result.insertId;

    //! orders 테이블 채우기
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, delivery_id,user_id) 
  VALUES (?, ?, ?, ?, ?);`;
    let value = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      delivery_id,
      userId,
    ];
    [result] = await conn.execute(sql, value);
    const order_id = result.insertId;

    // items 가지고 장바구니 조회 (아이디 삭제를위한 작업)

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
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  return result;
};

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
  const orderId = req.params.id;
  const conn = await mariadb.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
  });
  let sql = `SELECT book_id,title,author,price,quantity FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id=?`;
  let [result, fileds] = await conn.query(sql, [orderId]);
  return res.status(StatusCodes.OK).json(result);
};
//요청 req 응답 res

module.exports = { order, getOrders, getOrderDetail };
