// routes/mahasiswa.js
const express = require('express');
const prisma = require('../db');
const router = express.Router();

// GET /api/mahasiswa — ambil semua mahasiswa
router.get('/', async (req, res, next) => {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) { next(e); }
});

// GET /api/mahasiswa/:id — ambil satu mahasiswa
router.get('/:id', async (req, res, next) => {
  try {
    const m = await prisma.mahasiswa.findUnique({
      where: { id: +req.params.id }
    });
    if (!m) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    res.json(m);
  } catch (e) { next(e); }
});

// POST /api/mahasiswa — tambah mahasiswa baru
router.post('/', async (req, res, next) => {
  try {
    const { nim, nama, jurusan, angkatan, ipk } = req.body;
    if (!nim || !nama || !jurusan || !angkatan)
      return res.status(400).json({ error: 'nim, nama, jurusan & angkatan wajib diisi' });
    const m = await prisma.mahasiswa.create({
      data: { nim, nama, jurusan, angkatan: +angkatan, ipk: +(ipk || 0) }
    });
    res.status(201).json(m);
  } catch (e) {
    if (e.code === 'P2002')
      return res.status(400).json({ error: 'NIM sudah terdaftar' });
    next(e);
  }
});

// PUT /api/mahasiswa/:id — edit mahasiswa
router.put('/:id', async (req, res, next) => {
  try {
    const { nim, nama, jurusan, angkatan, ipk } = req.body;
    const m = await prisma.mahasiswa.update({
      where: { id: +req.params.id },
      data: { nim, nama, jurusan, angkatan: +angkatan, ipk: +ipk }
    });
    res.json(m);
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    next(e);
  }
});

// DELETE /api/mahasiswa/:id — hapus mahasiswa
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.mahasiswa.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025')
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    next(e);
  }
});

module.exports = router;