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
router.post('/orders', order);

// 주문목록 조회
router.get('/orders', getOrderDetail);

// 주문목록 책 상세 조회
router.get('/orders/:id', getOrders);

module.exports = router;
