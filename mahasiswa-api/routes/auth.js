// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password)
      return res.status(400).json({ error: 'Email & password wajib diisi' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password minimal 8 karakter' });

    // Cek email sudah ada
    const sudahAda = await prisma.user.findUnique({ where: { email } });
    if (sudahAda)
      return res.status(400).json({ error: 'Email sudah terdaftar' });

    // Hash password lalu simpan
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash },
      select: { id: true, email: true, role: true },
    });

    res.status(201).json({ message: 'Registrasi berhasil', user });
  } catch (e) { next(e); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email & password wajib diisi' });

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });

    // Cek password
    const ok = user && await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: 'Email atau password salah' });

    // Buat JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) { next(e); }
});

module.exports = router;