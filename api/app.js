const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3001;

const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: '',
  database: "maisto_produktu_sistema",
});

db.connect((err) => { err ? console.error('Error connecting to MySQL:', err) : console.log('Connected to MySQL'); });

app.get('/api/resources/categories/products', (req, res) => {
  const query = 
  `SELECT
    c.id,
    c.name,
    COUNT(p.id) as products_count,
    JSON_ARRAYAGG(
      JSON_OBJECT("name", p.name, "price", p.price, "description", p.description, "quantity", p.quantity, "weight", p.weight, 
      "type", p.type, "producer", p.producer, "seller", p.seller, "discount", p.discount)
    ) as products
  FROM categories c
  LEFT JOIN products p ON c.id = p.category_id
  GROUP BY c.id, c.name`;
  db.query(query, (err, results) => { err ? res.status(500).json({ error: 'Internal Server Error' }) : res.json(results); });
});

app.get('/api/resources/products/types', (req, res) => {
  db.query('SELECT DISTINCT type FROM products', (err, results) => { err ? res.status(500).json({ error: 'Internal Server Error' }) : 
  res.json(results); });
});

app.get('/api/resources/categories', (req, res) => {
  db.query('SELECT name FROM categories', (err, results) => { err ? res.status(500).json({ error: 'Internal Server Error' }) : res.json(results); });
});

app.get('/api/resources/products/:productId', (req, res) => {
  const productId = req.params.productId;
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) res.status(500).json({ error: 'Internal Server Error' });
    else {
      if (results.length > 0) res.json(results[0]);
      else res.status(404).json({ error: 'Product not found' });
    }
  });
});

app.listen(port, () => { console.log(`API server is running on port ${port}`); });