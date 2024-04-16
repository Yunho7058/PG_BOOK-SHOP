const express = require('express');
const router = express.Router();
router.use(express.json()); //json 형태로 사용
const { allBooks, bookDetail } = require('../controller/BookController');
// 카테고리별 조회
//router.get('/', bookByCategory);

// 전체도서 조회
router.get('/', allBooks);

// 개별 도서 조회
router.get('/:id', bookDetail);

module.exports = router;
