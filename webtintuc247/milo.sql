-- ===============================
-- DATABASE
-- ===============================

CREATE DATABASE IF NOT EXISTS milo_store;
USE milo_store;

-- ===============================
-- TABLE: Customers
-- ===============================

CREATE TABLE milo_customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- TABLE: Categories
-- ===============================

CREATE TABLE milo_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- ===============================
-- TABLE: Products
-- ===============================

CREATE TABLE milo_products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id)
    REFERENCES milo_categories(category_id)
);

-- ===============================
-- TABLE: Orders
-- ===============================

CREATE TABLE milo_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (customer_id)
    REFERENCES milo_customers(customer_id)
);

-- ===============================
-- TABLE: Order Details
-- ===============================

CREATE TABLE milo_order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    FOREIGN KEY (order_id)
    REFERENCES milo_orders(order_id),
    FOREIGN KEY (product_id)
    REFERENCES milo_products(product_id)
);

-- ===============================
-- INDEX
-- ===============================

CREATE INDEX idx_customer_email
ON milo_customers(email);

CREATE INDEX idx_product_name
ON milo_products(product_name);

CREATE INDEX idx_order_status
ON milo_orders(status);

-- ===============================
-- INSERT CATEGORY
-- ===============================

INSERT INTO milo_categories(category_name,description)
VALUES
('Laptop','Laptop Products'),
('Phone','Smart Phones'),
('Accessory','Accessories');

-- ===============================
-- INSERT CUSTOMERS
-- ===============================

INSERT INTO milo_customers(full_name,email,phone,address)
VALUES
('Nguyen Van A','a@gmail.com','0900000001','Ha Noi'),
('Tran Thi B','b@gmail.com','0900000002','Hai Phong'),
('Le Van C','c@gmail.com','0900000003','Da Nang'),
('Pham Thi D','d@gmail.com','0900000004','Hue'),
('Hoang Van E','e@gmail.com','0900000005','HCM');

-- ===============================
-- INSERT PRODUCTS
-- ===============================

INSERT INTO milo_products(category_id,product_name,price,stock)
VALUES
(1,'Dell Latitude',22000000,20),
(1,'HP Elitebook',21000000,15),
(1,'Macbook Air',32000000,10),
(2,'iPhone 15',26000000,18),
(2,'Samsung S25',24000000,25),
(2,'Xiaomi 15',17000000,30),
(3,'Wireless Mouse',350000,80),
(3,'Mechanical Keyboard',1200000,40),
(3,'USB Type C',180000,100),
(3,'Laptop Bag',450000,50);

-- ===============================
-- INSERT ORDERS
-- ===============================

INSERT INTO milo_orders(customer_id,status)
VALUES
(1,'Completed'),
(2,'Pending'),
(3,'Completed'),
(4,'Cancelled'),
(5,'Completed');

-- ===============================
-- INSERT ORDER DETAILS
-- ===============================

INSERT INTO milo_order_details(order_id,product_id,quantity,unit_price)
VALUES
(1,1,1,22000000),
(1,7,2,350000),
(2,4,1,26000000),
(3,5,1,24000000),
(3,8,1,1200000),
(4,10,1,450000),
(5,2,2,21000000);

-- ===============================
-- UPDATE TOTAL
-- ===============================

UPDATE milo_orders o
SET total_amount = (
SELECT SUM(quantity*unit_price)
FROM milo_order_details d
WHERE d.order_id=o.order_id
);

-- ===============================
-- VIEW
-- ===============================

CREATE VIEW milo_order_summary AS
SELECT
o.order_id,
c.full_name,
o.order_date,
o.total_amount,
o.status
FROM milo_orders o
JOIN milo_customers c
ON o.customer_id=c.customer_id;

-- ===============================
-- FUNCTION
-- ===============================

DELIMITER $$

CREATE FUNCTION milo_total_orders(cid INT)
RETURNS INT
DETERMINISTIC
BEGIN
DECLARE total INT;

SELECT COUNT(*)
INTO total
FROM milo_orders
WHERE customer_id=cid;

RETURN total;

END$$

DELIMITER ;

-- ===============================
-- STORED PROCEDURE
-- ===============================

DELIMITER $$

CREATE PROCEDURE milo_products_by_category(
IN cat INT
)
BEGIN

SELECT
product_id,
product_name,
price,
stock
FROM milo_products
WHERE category_id=cat;

END$$

DELIMITER ;

-- ===============================
-- TRIGGER
-- ===============================

DELIMITER $$

CREATE TRIGGER milo_reduce_stock
AFTER INSERT
ON milo_order_details
FOR EACH ROW
BEGIN

UPDATE milo_products
SET stock=stock-NEW.quantity
WHERE product_id=NEW.product_id;

END$$

DELIMITER ;

-- ===============================
-- SAMPLE QUERIES
-- ===============================

SELECT * FROM milo_customers;

SELECT * FROM milo_products;

SELECT * FROM milo_orders;

SELECT * FROM milo_order_summary;

SELECT
product_name,
price
FROM milo_products
WHERE price>1000000;

SELECT
customer_id,
full_name
FROM milo_customers
ORDER BY full_name;

SELECT
status,
COUNT(*) AS total
FROM milo_orders
GROUP BY status;

SELECT
product_name,
stock
FROM milo_products
ORDER BY stock DESC;

SELECT
AVG(price)
FROM milo_products;

SELECT
MAX(price)
FROM milo_products;

SELECT
MIN(price)
FROM milo_products;

SELECT
SUM(total_amount)
FROM milo_orders;

SELECT
customer_id,
milo_total_orders(customer_id)
AS total_orders
FROM milo_customers;

CALL milo_products_by_category(1);

CALL milo_products_by_category(2);

CALL milo_products_by_category(3);

-- ===============================
-- UPDATE EXAMPLES
-- ===============================

UPDATE milo_products
SET price=price*1.05
WHERE category_id=1;

UPDATE milo_customers
SET phone='0999999999'
WHERE customer_id=1;

UPDATE milo_orders
SET status='Completed'
WHERE order_id=2;

-- ===============================
-- DELETE EXAMPLES
-- ===============================

DELETE FROM milo_order_details
WHERE detail_id=999;

DELETE FROM milo_orders
WHERE order_id=999;

-- ===============================
-- END SCRIPT
-- ===============================