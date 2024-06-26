INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

SELECT * FROM books LEFT
JOIN category ON books.category_id = category.id;

SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id=1;


// 좋아요 추가
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);

// 좋아요 삭제
DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 3;

// 장바구니 담기
INSERT INTO cartItems (book_id, quantity, user_id) VALUES (1, 1, 1);

// 장바구니 아이템 목록 조회
SELECT cartItems.id, book_id, title, summary, quantity, price 
FROM cartItems LEFT JOIN books 
ON cartItems.book_id = books.id;

// 장바구니 아이템 조회
DELETE FROM cartItems WHERE id = ?;

// 장바구니에서 선택한(장바구니 도서 id) 아이템 목록 조회 (=선택한 장바구니 상품 목록 조회)
SELECT * FROM Bookshop.cartItems WHERE user_id=1 AND id IN (1,3)


// 주문하기
// 배송 정보 입력
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 중구", "김송아", "010-1234-5678");
const delivery_id = SELECT max(id) FROM delivery;

// 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
VALUES ("백설공주와 일곱남쟁이", 3, 60000, 1, delivery_id);
const order_id = SELECT max(id) FROM orders;

// 주문 상세 목록 입력
INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES (order_id, 1, 1);
INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES (order_id, 3, 2);


// 아이디값 
SELECT max(id) FROM Bookshop.orderedBook;
SELECT last_insert_id();

// 결제된 도서 장바구니 삭제
DELETE FROM cartItems WHERE id IN (1,2,3); 


// 페이지 네이션 1
SELECT * FROM Bookshop.books LIMIT 4 OFFSET 0;
SELECT count(*) FROM Bookshop.books;

// 페이지 네이션 2
SELECT SQL_CALC_FOUND_ROWS * FROM Bookshop.books LIMIT 4 OFFSET 0;
SELECT found_rows();