const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.listen(process.env.PORT); // 의미있는 포트 번호 작성하기

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const orederRouter = require('./routes/orders');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/orders', orederRouter);
app.use('/likes', likeRouter);
app.use('/carts', cartRouter);
