const express = require('express');
const router = express.Router();

// Data sementara
let products = [
  { id: 1, nama: 'Apel Fuji', kategori: 'buah', harga: 15000, stok: 100 },
  { id: 2, nama: 'Jeruk Mandarin', kategori: 'buah', harga: 8000, stok: 50 },
  { id: 3, nama: 'Wortel', kategori: 'sayur', harga: 5000, stok: 200 }
];
let nextId = 4;

// GET semua produk
router.get('/', (req, res) => {
  res.json(products);
});

// GET produk by id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  res.json(product);
});

// POST produk baru
router.post('/', (req, res) => {
  const { nama, harga, stok = 0, kategori } = req.body;
  
  if (!nama) return res.status(400).json({ error: 'Nama wajib diisi' });
  if (!harga) return res.status(400).json({ error: 'Harga wajib diisi' });
  
  const newProduct = { id: nextId++, nama, harga, stok, kategori };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE produk
router.delete('/:id', (req, res) => {
  const before = products.length;
  products = products.filter(p => p.id != req.params.id);
  
  if (products.length === before) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  res.status(204).send();
});

module.exports = router;