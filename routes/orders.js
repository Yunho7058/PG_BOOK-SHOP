const express = require('express');
//const conn = require('../mariadb');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const {
  order,
  getOrderDetail,
  getOrders,
} = require('../controller/OrderController');
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

// 결제하기(주문하기)
router.post('/', order);
// 주문목록 조회
router.get('/', getOrders);

// 주문목록 책 상세 조회
router.get('/:id', getOrderDetail);

module.exports = router;
