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
});