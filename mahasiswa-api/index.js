<<<<<<< HEAD
// index.js — versi final (P3)
require('dotenv').config(); // HARUS PALING PERTAMA

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(express.json());

// P3: import middleware
const authGuard = require('./middleware/authGuard');

const authRouter = require('./routes/auth');
const mahasiswaRouter = require('./routes/mahasiswa');

// /api/auth → public (tidak perlu token)
app.use('/api/auth', authRouter);

// /api/mahasiswa → butuh login (authGuard)
app.use('/api/mahasiswa', authGuard, mahasiswaRouter);

// Global error handler — HARUS PALING BAWAH
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500)
    .json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di port 3000`);
=======
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const products = [
  { id: 1, nama: "Apel Fuji", harga: 15000 },
  { id: 2, nama: "Jeruk Mandarin", harga: 8000 },
  { id: 3, nama: "Wortel", harga: 5000 }
];

app.get('/', (req, res) => {
  res.json({ message: "API JALAN! Buka /products" });
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }
  res.json(product);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
>>>>>>> 58d13ba6d0554485223b93a37b9d49a94b413e66
});