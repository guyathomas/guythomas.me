---
title: Complete SQL Bootcamp
date: "2020-03-12T20:39:13.695Z"
description: "Notes from https://www.udemy.com/course/the-complete-sql-bootcamp/"
---

`Between` Syntax

```sql
SELECT COUNT(*)
FROM orders
WHERE shippeddate BETWEEN '2000-01-01' AND '2001-01-01';
```

`ORDER BY`

```sql
SELECT DISTINCT country, city FROM suppliers ORDER BY country ASC, city DESC;
```

`MIN` `MAX`
Most recent `shipdate` from Canada

```sql
SELECT MAX(shippeddate) FROM ORDERS WHERE shipcountry = 'Canada';
```

The longest shipping time for orders to France

```sql
SELECT MAX(shippeddate - orderdate) FROM ORDERS WHERE shipcountry = 'France';
```

`AVG`

```sql
SELECT AVG(freight) FROM orders where shipcountry = 'Brazil';
```

`LIKE`

```sql
SELECT companyname FROM suppliers WHERE companyname LIKE '_or%';
```

`INNER JOIN` on multiple tables with a `WHERE` clause

```sql
SELECT companyname, productname, categoryname,
	    orderdate, order_details.unitprice, quantity
FROM orders
JOIN order_details ON orders.orderid=order_details.orderid
JOIN customers ON customers.customerid=orders.customerid
JOIN products ON products.productid=order_details.productid
JOIN categories ON categories.categoryid=products.categoryid
WHERE categoryname='Seafood' AND
		order_details.unitprice*quantity >= 500;
```

`LEFT JOIN` will pull all records from table 1, and make it clear if any records in table 1 are missing records in table 2

```sql
select companyname, orderid from customers LEFT JOIN orders on orders.customerid=customers.customerid;
-- companyname                          |   orderid
-- Richter Supermarkt                   |   11075
-- Bon app'                             |   11076
-- Rattlesnake Canyon Grocery           |   11077
-- Paris spécialités                    |
-- FISSA Fabrica Inter. Salchichas S.A. |

-- Add 'WHERE orderid IS NULL' to just get those rows
```

`FULL JOIN` will pull all from the left, regardless if they have a matching in the right, and vise versa. i.e. when joining orders and customers you will see orders without customers, and customers without orders

```sql
SELECT companyname, orderid
FROM orders
FULL JOIN customers ON customers.customerid=orders.customerid;
```

Self Join - useful for:

- Hierarchy - employees who report to other employess
- Look for similarities and dissimilarities in the same column - everyone in the same city or same birthdate

```sql
-- Enumerate through all the combinations of people in the same city
SELECT A.companyname AS CustomerName1, B.companyname AS CustomerName2, A.city
FROM customers A, customers B
WHERE A.customerid <> B.customerid -- Obviously a customer is in the same city as themselves, so don't show these
AND A.city = B.city
AND A.city = 'Buenos Aires';

 customername1 | customername2 |     city
---------------+---------------+--------------
 Cactu         | Océan         | Buenos Aires
 Cactu         | Ranch         | Buenos Aires
 Océan         | Cactu         | Buenos Aires
 Océan         | Ranch         | Buenos Aires
 Ranch         | Cactu         | Buenos Aires
 Ranch         | Océan         | Buenos Aires
```

`USING`
Useful for referencing the same column name on two different tables

```sql
SELECT * FROM orders JOIN order_details USING(orderid);
-- Equivalent to
SELECT * FROM orders.orderid JOIN order_details.orderid;
```

`NATURAL`

```sql
SELECT * FROM orders NATURAL JOIN order_details;

-- Equivalent to:
SELECT * FROM orders JOIN order_details ON orders.orderid = order_details.orderid;
```

`COUNT`

```sql
SELECT country, COUNT(*)
FROM customers
GROUP BY country
ORDER BY COUNT(*) DESC;

   country   | count
-------------+-------
 USA         |    13
 Germany     |    11
 France      |    11
 Brazil      |     9
 UK          |     7
```

`COUNT` with JOIN

```sql
SELECT categoryname, COUNT(*)
FROM categories
INNER JOIN products ON products.categoryid = categories.categoryid
GROUP BY categoryname
ORDER BY COUNT(*) DESC;
```

Total value of orders for each product in 1997

```sql
SELECT productname, ROUND(SUM(order_details.unitprice * order_details.quantity)) as total_sales
FROM products
INNER JOIN order_details ON products.productid = order_details.productid USING()
INNER JOIN orders ON order_details.orderid = orders.orderid
WHERE orderdate BETWEEN '1997-01-01' AND '1997-12-31' GROUP BY productname
ORDER BY productname;
```

`HAVING` vs `WHERE`

- `WHERE` filters records **before** grouping
- `HAVING` filters records **after** grouping

`GROUPING SETS`
For grouping a parent, then the subgroups of the parent. i.e. the following query will show the `purchase_sum` for each different `supplier` for a given `buyer`. Where the `supplier` is `null`, that represents the total for **all** suppliers.

```sql
SELECT
	LEFT(customers.companyname,5) as buyer,
	LEFT(suppliers.companyname,5) as supplier,
	ROUND(SUM(order_details.quantity * order_details.unitprice)) as purchase_sum
FROM suppliers                                                                                                                  NATURAL JOIN products                                                                                                                  NATURAL JOIN order_details                                                                                                             NATURAL JOIN orders                                                                                                                    INNER JOIN customers ON orders.customerid = customers.customerid
GROUP BY GROUPING SETS((buyer), (buyer, supplier));

 buyer | supplier | round
-------+----------+-------
 Alfre | Aux j    |   378
 Alfre | Escar    |   530
 Alfre | Exoti    |    60
 Alfre | Gai p    |   825
 Alfre | Grand    |   400
 Alfre | Karkk    |   270
 Alfre | Lyngb    |    24
 Alfre | Norsk    |   430
 Alfre | Pavlo    |   878
 Alfre | Plutz    |   801
 Alfre |          |  4596
 Ana T | Coope    |    42
 Ana T | Forma    |   668
 Ana T | Gai p    |   340
 Ana T | Leka     |    70
 Ana T | Mayum    |   130
 Ana T | Speci    |    64
 Ana T |          |  1314
 Anton | Bigfo    |   560
 Anton | Coope    |  1050
```

`GROUPING SETS` with `NULLS FIRST`
Total sales grouped by customer `companyname` and `categoryname` , order by companyname, category name with `NULL` first

```sql
SELECT companyname, categoryname, ROUND(SUM(od.quantity * od.unitprice)) as total_sales
FROM customers
INNER JOIN orders USING(customerid)
INNER JOIN order_details as od USING(orderid)
INNER JOIN products USING(productid)
INNER JOIN categories USING(categoryid)
GROUP BY GROUPING SETS ((companyname), (companyname, categoryname))
ORDER BY companyname, categoryname NULLS FIRST;
```

`ROLLUP`
Shorthand for multiple grouping sets

```sql
SELECT LEFT(c.contactname, 5) as contactname, categoryname, LEFT(productname, 5) as productname, ROUND(SUM(od.unitprice * od.quantity)) as purchase_value
FROM categories
INNER JOIN products USING(categoryid)
INNER JOIN order_details as od USING(productid)
INNER JOIN orders USING(orderid)
INNER JOIN customers AS c USING(customerid)
GROUP BY ROLLUP (contactname,categoryname,productname)
ORDER BY contactname,categoryname,productname
NULLS FIRST;

contactname |  categoryname  | productname | purchase_value
-------------+----------------+-------------+----------------
 Aleja       | Beverages      |             |             79
 Aleja       | Beverages      | Guara       |             22
 Aleja       | Beverages      | Steel       |             58
 Aleja       | Confections    |             |             32
 Aleja       | Confections    | Scott       |             25
 Aleja       | Confections    | Teati       |              7
 Aleja       | Dairy Products |             |            340
 Aleja       | Dairy Products | Camem       |            340
```

`CUBE`
Does all subsets i.e.
`CUBE (a,b,c)` is equivalent to

```sql
GROUPING SETS (
(a,b,c),
(a,b),
(a,c),
(b,c),
(a),
(b),
(c),
()
)
```

```sql
SELECT suppliers.companyname as suppliername, productname, c.contactname,
ROUND(SUM(od.quantity * od.unitprice)) as total_sales
FROM customers AS c
INNER JOIN orders USING(customerid)
INNER JOIN order_details as od USING(orderid)
INNER JOIN products USING(productid)
INNER JOIN suppliers USING(supplierid)
GROUP BY CUBE(suppliers.companyname, productname, c.contactname)
ORDER BY suppliers.companyname NULLS FIRST, productname NULLS FIRST, c.contactname NULLS FIRST;
```

`UNION`
Combine the results of two queries, into one set
Must have same number of columns and the columns must be the same types

```sql
SELECT country
FROM customers
UNION
SELECT country
FROM suppliers
ORDER BY country;

 Argentina
 Australia
 Austria
 Belgium
 Brazil
```

`UNION ALL`
Will include duplicates, if the value occurs twice

```sql
SELECT country
FROM customers
UNION ALL
SELECT country
FROM suppliers
ORDER BY country;

Argentina
Argentina
Argentina
Australia
Australia
Austria
Austria
```

`INTERSECT`
Find all countries that we have customers and suppliers in

```sql
SELECT country
FROM suppliers
INTERSECT
SELECT country
FROM customers;
```

`INTERSECT ALL`
Similar to intersect, but does not remove duplicates

```sql
SELECT country
FROM suppliers
INTERSECT ALL
SELECT country
FROM customers;
```

`EXCEPT`
Find items the are in the first query, but not the second

- Find countries with customers, but **not** suppliers

```sql
SELECT country from customers
EXCEPT
SELECT country from suppliers;
```

`EXCEPT ALL`
Similar to above, but returns all records from the first table which are not present in the second table, leaving the duplicates as is.

```sql
SELECT COUNT (*) FROM
(SELECT country from customers
EXCEPT ALL
SELECT country from suppliers
) as customers_without_a_supplier_in_city;
```

Cities where there is a supplier, but not customer

```sql
SELECT city from suppliers
EXCEPT ALL
SELECT city from customers;
```

`EXISTS`
A subquery is where you have another query in the `WHERE` clause of the first query.
All suppliers with a product that costs more than $200

```sql
SELECT companyname
FROM suppliers
WHERE EXISTS (
	SELECT productid
	FROM products
	WHERE products.supplierid = suppliers.supplierid
	AND unitprice > 200
);
```

`ANY`
Find an order where a customer has ordered more than 50 items

```sql
SELECT companyname
FROM customers
WHERE customerid = ANY (
	SELECT customerid
	FROM orders
	JOIN order_details
	ON orders.orderid=order_details.orderid
	WHERE quantity > 50
);
-- This is actually equivalent to this query
SELECT DISTINCT(companyname)
FROM customers
INNER JOIN orders USING(customerid)
INNER JOIN order_details USING(orderid)
WHERE quantity > 50;
```

## Subqueries

[Subqueries](https://www.essentialsql.com/get-ready-to-learn-sql-server-19-introduction-to-sub-queries/) can be used to return either a scalar (single) value or a row set; whereas, joins are used to return rows.

- A common use for a subquery may be to calculate a summary value for use in a query. For instance we can use a subquery to help us obtain all products have a greater than average product price.

```sql
SELECT ProductID,
       Name,
       ListPrice,
       (SELECT AVG(ListPrice)
          FROM Production.Product) AS AvgListPrice
  FROM Production.Product
 WHERE ListPrice > (SELECT AVG(ListPrice)
  FROM Production.Product)

```

`ALL`
Distinct customers that ordered more in one item, that the average order amount for that item of all customers

```sql
SELECT companyname
FROM customers
JOIN orders USING(customerid)
JOIN order_details USING(orderid)
WHERE order_details.unitprice * quantity > ALL (
	SELECT AVG(order_details.unitprice * quantity)
	FROM order_details
	GROUP BY productid, productid
)
;
```

`IN`
All suppliers that are in the same city as a customer

```sql
SELECT companyname
FROM suppliers
WHERE city IN ( SELECT city from customers )
;
```

## PLpgSQL Functions

`RETURN` is equivalent to `SELECT` in the function

```sql
DROP ROUTINE IF EXISTS max_price();

CREATE OR REPLACE FUNCTION max_price() RETURNS real AS $$
BEGIN
	RETURN MAX(unitprice)
	FROM products;
END;
$$ LANGUAGE plpgsql;

SELECT max_price();
```

Function to find the largest order amount

```sql
DROP ROUTINE IF EXISTS largest_order();

CREATE OR REPLACE FUNCTION largest_order() RETURNS double precision AS $$
BEGIN
	RETURN MAX(amount)
	FROM (SELECT SUM(unitprice * quantity) as amount, orderid FROM order_details GROUP BY orderid ) as totals;
END;
$$ LANGUAGE plpgsql;

SELECT largest_order();
```

```sql
CREATE OR REPLACE FUNCTION sum_n_product(
x int,
y int,
OUT sum int, -- Define return value
OUT product int -- Define return value
) AS $$
BEGIN
	sum := x + y;  -- Assign return value
	product := x * y;  -- Assign return value
	RETURN;
END;
$$ LANGUAGE plpgsql;

SELECT sum_n_product(5, 20);
```

```sql
CREATE OR REPLACE FUNCTION square_and_cube(
x int,
OUT square int,
OUT cube int
) AS $$
BEGIN
	square := x * x;
	cube := x * x * x;
	RETURN;
END;
$$ LANGUAGE plpgsql;

SELECT square_and_cube(5);
```

Returning query results with `SETOF`

```sql
CREATE OR REPLACE FUNCTION sold_more_than(
total_sales real
) RETURNS SETOF products AS $$
BEGIN
    RETURN QUERY SELECT *
    FROM products
    WHERE productid IN (
        SELECT productid FROM (
            SELECT SUM(quantity*unitprice), productid
            FROM order_details
            GROUP BY productid
            HAVING SUM(quantity * unitprice) > total_sales
        ) as qualified_products
    );
END;
$$ LANGUAGE plpgsql;

SELECT (sold_more_than(25000)).* -- 'spread' the columns out of the tuple
```

```sql
CREATE OR REPLACE FUNCTION suppliers_to_reorder_from() RETURNS SETOF suppliers AS $$
BEGIN
	RETURN QUERY
	SELECT * FROM suppliers
	WHERE supplierid IN (
		SELECT supplierid
		FROM products
		WHERE (unitsinstock+unitsonorder)<reorderlevel
	);
END;
$$ LANGUAGE plpgsql;

SELECT suppliers_to_reorder_from();
```

### Declaring variables

```sql
CREATE OR REPLACE FUNCTION middle_priced() RETURNS SETOF products AS $$
DECLARE
	average_price real;
	bottom_price real;
	top_price real;
BEGIN
	SELECT AVG(unitprice) INTO average_price
	FROM products;

	bottom_price := average_price * 0.75;
	top_price := average_price * 1.25;

	RETURN QUERY
		SELECT *
		FROM products
		WHERE unitprice
		BETWEEN bottom_price AND top_price;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM middle_priced();
```

### Looping through query results

```sql
CREATE OR REPLACE FUNCTION reports_to(
IN eid smallint,
OUT employeeid smallint,
OUT reportsto smallint
) RETURNS SETOF record AS $$ -- record refers to whatever is defined in your out parameters
WITH RECURSIVE reports_to(employeeid, reportsto) AS (
	SELECT employeeid, reportsto
	FROM employees
	WHERE employeeid = eid
	UNION ALL
	SELECT manager.employeeid, manager.reportsto
	FROM employees AS manager
	JOIN reports_to
	ON reports_to.reportsto = manager.employeeid
);
$$ LANGUAGE SQL;

SELECT * from reports_to();

```

## Triggers

- Must have a `plpgsql` function that can handle trigger call
  - No arguments
  - Return a trigger
  - Return `NULL` or a record/row value having the structure of the table that the trigger was fired for
- CREATE TRIGGER mapping the table and action to the function
  Two variables available in the trigger

1. `insert` / `update` - NEW - holds the new database row
2. `update` / `delete` - OLD - holds the old database row

```sql
ALTER TABLE employees
ADD COLUMN last_updated timestamp;

CREATE OR REPLACE FUNCTION employees_timestamp() RETURNS trigger AS $$
BEGIN

	NEW.last_updated := now();
	RETURN NEW;

END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS employees_timestamp ON employees;

CREATE TRIGGER employees_timestamp BEFORE INSERT OR UPDATE ON employees
	FOR EACH ROW EXECUTE FUNCTION employees_timestamp();
```
