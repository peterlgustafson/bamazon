DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT(11) NOT NULL,
  stock_quantity INT(11) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wireless Mouse", "Electronics", "15", "1000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bose Wireless Headphones", "Electronics", "349", "500");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Instant Pot", "Kitchen", "99", "1000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamboo Travel Utensils Set", "Kitchen", "12", "750");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stand Up PaddleBoard", "Outdoors", "449", "800");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1 Person Inflatable Kayak", "Outdoors", "69", "600");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("K-CUP Pods, 100 count", "Grocery", "43", "2000");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("RXBAR Whole Food Protein Bar, 12 count", "Grocery", "22", "600");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cracking the Coding Interview", "Books", "34", "400");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Clean Code: A Handbook of Agile Software Craftmanship", "Books", "38", "300");
