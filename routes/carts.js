const express = require('express');
//const conn = require('../mariadb');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json());
dotenv.config();

// 장바구니 담기
router.post('/', (req, res) => {});

// 조회
router.get('/', (req, res) => {});

//삭제
router.delete('/:id', (req, res) => {});

// 장바구니 책 조회
router.get('/items/:id', (req, res) => {});

module.exports = router;
