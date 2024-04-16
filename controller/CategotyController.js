const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
let dotenv = require('dotenv');
dotenv.config();

const allCategoryLoad = (req, res) => {
  conn.query(`SELECT * FROM category`, (err, results) => {
    if (err) {
      res.status(StatusCodes.NOT_FOUND).end();
      //throw err;
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategoryLoad };
