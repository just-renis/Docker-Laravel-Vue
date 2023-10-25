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

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/api/categories', (req, res) => {
  const query = 
  `SELECT
    c.id,
    c.name,
    COUNT(p.id) as product_count,
    JSON_ARRAYAGG(
      JSON_OBJECT("name", p.name, "price", p.price, "description", p.description)
    ) as products
  FROM categories c
  LEFT JOIN products p ON c.id = p.category_id
  GROUP BY c.id, c.name`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});