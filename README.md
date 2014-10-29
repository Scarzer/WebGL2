# Project 1
## Written by Irving Derin

### Part 1: Creating the tables

- Product Table
``` mysql
CREATE TABLE product (
    maker CHAR(1),
    model INT,
    type  ENUM("pc", "laptop", "printer")
);
```

- PC Table
``` mysql
CREATE TABLE pc (
    model   INT,
    speed   FLOAT,
    ram     INT,
    hd      INT,
    price   INT
);
```

- Laptop Table
``` mysql
CREATE TABLE laptop (
    model   INT,
    speed   FLOAT,
    ram     INT,
    hd      INT,
    screen  FLOAT,
    price   INT
);
```

- Printer Table
``` mysql
CREATE TABLE printer(
    model  INT,
    color  BOOL,
    type   ENUM("ink-jet", "laser"),
    price  INT
);
```

### Part 2: Importing the data
Importing the data was fairly straight forward. I made two data modifications. One modification was made in the Printer table. The color table was changed from {"False", "True"} to {0, 1}. The second modification was the removal of the 5th column in the PC table. It was all "none".

### Part 3: Making the queries

- Query A: What PC models have a speed of at least 3.00? 
``` mysql
SELECT model,speed from pc WHERE speed > 3.0
```
The result to this query is: 

mysql> select model,speed from pc where speed > 3.0;
|-------|-------|
| model | speed |
|-------|-------|
|  1005 |   3.2 |
|  1006 |   3.2 |
|  1013 |  3.06 |
|-------|-------|
3 rows in set (0.00 sec)

- Query B: Which manufactures makes laptop with a hard disk of at the least 100GB? 

``` mysql
SELECT DISTINCT maker 
FROM product 
WHERE model IN 
(
    SELECT model 
    FROM laptop 
    WHERE hd >= 100
);
```
mysql> SELECT DISTINCT maker  FROM product  WHERE model IN  (     SELECT model      FROM laptop      WHERE hd >= 100 );
|-------|
| maker |
|-------|
| A     |
| E     |
| F     |
| G     |
|-------|
4 rows in set (0.00 sec)


- Query C: Find the model number and price of all products (of any type) made by manufacture B. 

``` mysql
SELECT P.model, P.price 
FROM(
    SELECT model, price 
    FROM laptop 
    UNION 
    SELECT model, price 
    FROM printer 
    UNION 
    SELECT model, price 
    FROM pc
) 
AS P, product 
WHERE maker ='B' AND 
product.model = P.model;

```
mysql> SELECT P.model, P.price  FROM(     SELECT model, price      FROM laptop      UNION      SELECT model, price      FROM printer      UNION      SELECT model, price      FROM pc )  AS P, product  WHERE maker ='B' AND  product.model = P.model;
|-------|-------|
| model | price |
|-------|-------|
|  1005 |   630 |
|  1004 |   649 |
|  1006 |  1049 |
|  2007 |  1150 |
|-------|-------|
4 rows in set (0.00 sec)



- Query D: Find distinct pairs of PC models with same CPU speed and RAM capacity
``` mysql
SELECT P1.model
FROM pc AS P1, pc AS P2 
WHERE P1.model <> P2.model
AND
P1.speed = P2.speed
AND
P1.ram = P2.ram;

```
mysql> SELECT P1.model FROM pc AS P1, pc AS P2 WHERE P1.model <> P2.model AND P1.speed = P2.speed AND P1.ram = P2.ram;
|-------|
| model |
|-------|
|  1012 |
|  1004 |
|-------|
2 rows in set (0.00 sec)
