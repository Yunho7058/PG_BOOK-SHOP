const express = require('express');
const {
  getAllItem,
  addItem,
  removeItem,
} = require('../controller/CartsController');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json());
dotenv.config();

// 장바구니 담기
router.post('/', addItem);

// 조회
router.get('/', getAllItem);

//삭제
router.delete('/:id', removeItem);

module.exports = router;
