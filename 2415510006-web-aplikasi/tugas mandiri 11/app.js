if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap')
  document.querySelector('#theme-btn').textContent = 'Mode Terang'
}

document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap')
  const gelap = document.body.classList.contains('gelap')
  document.querySelector('#theme-btn').textContent = gelap ? 'Mode Terang' : 'Mode Gelap'
  localStorage.setItem('tema', gelap ? 'gelap' : 'terang')
})

function gantiTab(id) {
  document.querySelectorAll('.panel, .tombol-tab').forEach(el => el.classList.remove('aktif'))
  document.querySelector('#' + id).classList.add('aktif')
  document.querySelector(`[data-tab='${id}']`).classList.add('aktif')
  if (id === 'leaderboard') tampilLeaderboard()
}

document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab))
})

document.querySelectorAll('.judul-akordion').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.item-akordion').classList.toggle('terbuka')
  })
})

const modal = document.querySelector('#modal')
document.querySelector('#btn-modal').addEventListener('click', () => modal.classList.add('terbuka'))
document.querySelector('#btn-tutup-modal').addEventListener('click', () => modal.classList.remove('terbuka'))
document.querySelector('#btn-ke-daftar').addEventListener('click', () => {
  modal.classList.remove('terbuka')
  gantiTab('daftar')
})
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('terbuka') })
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.classList.remove('terbuka')
  if (!gameAktif) return
  const huruf = e.key.toUpperCase()
  if (huruf.length === 1 && huruf >= 'A' && huruf <= 'Z') {
    kata += huruf
    document.querySelector('#hasil-kata').textContent = kata
  }
  if (e.key === 'Backspace') {
    kata = kata.slice(0, -1)
    document.querySelector('#hasil-kata').textContent = kata || 'Klik huruf untuk mulai...'
  }
  if (e.key === 'Enter') cekJawaban()
})

const semuaSoal = [
  { kata: 'KUCING', hint: 'Hewan peliharaan yang suka ikan', kat: 'hewan' },
  { kata: 'ANJING', hint: 'Hewan penjaga rumah', kat: 'hewan' },
  { kata: 'BURUNG', hint: 'Hewan yang bisa terbang', kat: 'hewan' },
  { kata: 'KUDA', hint: 'Hewan yang bisa ditunggangi', kat: 'hewan' },
  { kata: 'GAJAH', hint: 'Hewan terbesar di darat', kat: 'hewan' },
  { kata: 'HARIMAU', hint: 'Kucing besar berbulu loreng', kat: 'hewan' },
  
  { kata: 'BUKU', hint: 'Tempat membaca ilmu', kat: 'benda' },
  { kata: 'MEJA', hint: 'Tempat belajar', kat: 'benda' },
  { kata: 'KURSI', hint: 'Tempat duduk', kat: 'benda' },
  { kata: 'KOMPUTER', hint: 'Alat elektronik untuk bekerja', kat: 'benda' },
  { kata: 'PENSIL', hint: 'Alat tulis dari kayu', kat: 'benda' },
  { kata: 'JENDELA', hint: 'Lubang di dinding untuk cahaya', kat: 'benda' },
  
  { kata: 'SEKOLAH', hint: 'Tempat menuntut ilmu', kat: 'tempat' },
  { kata: 'RUMAH', hint: 'Tempat tinggal', kat: 'tempat' },
  { kata: 'PASAR', hint: 'Tempat jual beli', kat: 'tempat' },
  { kata: 'MASJID', hint: 'Tempat ibadah umat Islam', kat: 'tempat' },
  { kata: 'PANTAI', hint: 'Pinggir laut', kat: 'tempat' },
  { kata: 'PERPUSTAKAAN', hint: 'Tempat menyimpan banyak buku', kat: 'tempat' },
]

let kata = ''
let skor = 0
let level = 1
let combo = 0
let comboTertinggi = 0
let timerDetik = 30
let intervalTimer = null
let soalSekarang = null
let gameAktif = false
let soalSelesai = 0
let totalSoal = 10
let katBenar = 0
let kategoriAktif = 'semua'
let highscore = parseInt(localStorage.getItem('highscore') || '0')

document.querySelector('#highscore').textContent = highscore

const grid = document.querySelector('.grid-huruf')
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(h => {
  const kotak = document.createElement('div')
  kotak.classList.add('kotak-huruf')
  kotak.textContent = h
  kotak.addEventListener('click', () => {
    if (!gameAktif) return
    kata += h
    document.querySelector('#hasil-kata').textContent = kata
  })
  grid.appendChild(kotak)
})

document.querySelectorAll('.btn-kategori').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-kategori').forEach(b => b.classList.remove('aktif'))
    btn.classList.add('aktif')
    kategoriAktif = btn.dataset.kat
  })
})

document.querySelector('#btn-hapus').addEventListener('click', () => {
  if (!gameAktif) return
  kata = kata.slice(0, -1)
  document.querySelector('#hasil-kata').textContent = kata || 'Klik huruf untuk mulai...'
})

document.querySelector('#btn-reset').addEventListener('click', () => {
  if (!gameAktif) return
  kata = ''
  document.querySelector('#hasil-kata').textContent = 'Klik huruf untuk mulai...'
})

document.querySelector('#btn-skip').addEventListener('click', () => {
  if (!gameAktif) return
  skor = Math.max(0, skor - 5)
  combo = 0
  updateInfo()
  tampilPesan('Soal dilewati! -5 poin 😅', 'habis')
  soalSelesai++
  setTimeout(() => soalBerikutnya(), 1000)
})

document.querySelector('#btn-mulai').addEventListener('click', () => {
  skor = 0
  level = 1
  combo = 0
  comboTertinggi = 0
  soalSelesai = 0
  katBenar = 0
  gameAktif = true
  updateInfo()
  updateProgress()
  tampilSoal()
})

document.querySelector('#btn-cek').addEventListener('click', cekJawaban)

function cekJawaban() {
  if (!gameAktif || !soalSekarang) return

  if (kata.toUpperCase() === soalSekarang.kata) {
    combo++
    katBenar++
    if (combo > comboTertinggi) comboTertinggi = combo

    let poin = level * 10
    if (combo >= 3) {
      poin += combo * 5
      tampilPesan(`🔥 COMBO x${combo}! +${poin} poin!`, 'combo')
    } else {
      tampilPesan(`Benar! +${poin} poin ✅`, 'benar')
    }

    skor += poin
    soalSelesai++
    if (soalSelesai % 10 === 0) level++

    updateInfo()
    updateProgress()
    setTimeout(() => soalBerikutnya(), 1200)

  } else {
    combo = 0
    updateInfo()
    tampilPesan('Salah! Coba lagi 😅', 'salah')

    const hasilEl = document.querySelector('#hasil-kata')
    hasilEl.classList.add('goyang')
    setTimeout(() => hasilEl.classList.remove('goyang'), 400)

    kata = ''
    document.querySelector('#hasil-kata').textContent = 'Klik huruf untuk mulai...'
  }
}

function soalBerikutnya() {
  if (soalSelesai >= totalSoal) {
    gameOver()
    return
  }
  tampilSoal()
}

function tampilSoal() {
  let pool = kategoriAktif === 'semua' ? semuaSoal : semuaSoal.filter(s => s.kat === kategoriAktif)
  soalSekarang = pool[Math.floor(Math.random() * pool.length)]

  document.querySelector('#soal-kata').textContent = soalSekarang.kata.split('').join(' ')
  document.querySelector('#hint-text').textContent = 'Hint: ' + soalSekarang.hint

  kata = ''
  document.querySelector('#hasil-kata').textContent = 'Klik huruf untuk mulai...'
  sembunyikanPesan()
  mulaiTimer()
}

function mulaiTimer() {
  clearInterval(intervalTimer)
  timerDetik = level >= 3 ? 20 : level === 2 ? 25 : 30
  const timerEl = document.querySelector('#timer')
  timerEl.textContent = timerDetik
  timerEl.classList.remove('timer-bahaya')

  intervalTimer = setInterval(() => {
    timerDetik--
    timerEl.textContent = timerDetik
    if (timerDetik <= 10) timerEl.classList.add('timer-bahaya')
    if (timerDetik <= 0) {
      clearInterval(intervalTimer)
      combo = 0
      updateInfo()
      tampilPesan('Waktu habis! ⏰', 'habis')
      soalSelesai++
      setTimeout(() => soalBerikutnya(), 1200)
    }
  }, 1000)
}

function updateInfo() {
  document.querySelector('#skor').textContent = skor
  document.querySelector('#level').textContent = level
  document.querySelector('#combo').textContent = combo
  if (skor > highscore) {
    highscore = skor
    localStorage.setItem('highscore', highscore)
    document.querySelector('#highscore').textContent = highscore
  }
}

function updateProgress() {
  const pct = (soalSelesai / totalSoal) * 100
  document.querySelector('#progress-isian').style.width = pct + '%'
  document.querySelector('#progress-teks').textContent = soalSelesai + ' / ' + totalSoal
}

function tampilPesan(teks, tipe) {
  const el = document.querySelector('#pesan-game')
  el.textContent = teks
  el.className = 'pesan-game ' + tipe
}

function sembunyikanPesan() {
  document.querySelector('#pesan-game').className = 'pesan-game tersembunyi'
}

function gameOver() {
  clearInterval(intervalTimer)
  gameAktif = false
  document.querySelector('#skor-akhir').textContent = skor
  document.querySelector('#benar-akhir').textContent = katBenar
  document.querySelector('#combo-akhir').textContent = comboTertinggi
  document.querySelector('#modal-gameover').classList.add('terbuka')
}

document.querySelector('#btn-simpan-skor').addEventListener('click', () => {
  const nama = document.querySelector('#input-nama-lb').value.trim()
  if (!nama) return alert('Masukkan namamu dulu!')
  const data = JSON.parse(localStorage.getItem('leaderboard') || '[]')
  data.push({ nama, skor, waktu: new Date().toLocaleDateString() })
  data.sort((a, b) => b.skor - a.skor)
  localStorage.setItem('leaderboard', JSON.stringify(data.slice(0, 10)))
  document.querySelector('#modal-gameover').classList.remove('terbuka')
  gantiTab('leaderboard')
})

document.querySelector('#btn-main-lagi').addEventListener('click', () => {
  document.querySelector('#modal-gameover').classList.remove('terbuka')
  document.querySelector('#btn-mulai').click()
})

function tampilLeaderboard() {
  const data = JSON.parse(localStorage.getItem('leaderboard') || '[]')
  const list = document.querySelector('#list-leaderboard')
  if (data.length === 0) {
    list.innerHTML = '<p class="kosong">Belum ada skor. Ayo main dulu!</p>'
    return
  }
  const emoji = ['🥇', '🥈', '🥉']
  list.innerHTML = data.map((item, i) => `
    <div class="lb-item">
      <span class="lb-rank">${emoji[i] || (i + 1)}</span>
      <span class="lb-nama">${item.nama}</span>
      <span class="lb-skor">${item.skor} poin</span>
      <span style="opacity:0.5; font-size:0.8rem">${item.waktu}</span>
    </div>
  `).join('')
}

document.querySelector('#btn-hapus-lb').addEventListener('click', () => {
  if (confirm('Yakin hapus semua leaderboard?')) {
    localStorage.removeItem('leaderboard')
    tampilLeaderboard()
  }
})

function validasi(id, aturan, pesan) {
  const el = document.querySelector('#' + id)
  const err = el.nextElementSibling
  const lulus = aturan(el.value.trim())
  el.classList.toggle('valid', lulus)
  el.classList.toggle('invalid', !lulus && el.value !== '')
  if (err && err.classList.contains('pesan-error')) {
    err.textContent = lulus ? '' : pesan
  }
  return lulus
}

document.querySelector('#nama').addEventListener('input', () =>
  validasi('nama', v => v.length >= 3, 'Minimal 3 karakter')
)

document.querySelector('#email').addEventListener('input', () =>
  validasi('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email tidak valid')
)

document.querySelector('#password').addEventListener('input', e => {
  validasi('password', v => v.length >= 8, 'Minimal 8 karakter')
  const pct = Math.min(e.target.value.length / 12 * 100, 100)
  const isian = document.querySelector('.isian')
  const label = document.querySelector('.label-kekuatan')
  isian.style.width = pct + '%'
  if (pct < 40) {
    isian.style.background = '#e54b5a'
    label.textContent = 'Lemah'
    label.style.color = '#e54b5a'
  } else if (pct < 75) {
    isian.style.background = '#ff9933'
    label.textContent = 'Sedang'
    label.style.color = '#ff9933'
  } else {
    isian.style.background = '#27c467'
    label.textContent = 'Kuat'
    label.style.color = '#27c467'
  }
})

document.querySelector('#formulir').addEventListener('submit', e => {
  e.preventDefault()
  const ok = [
    validasi('nama', v => v.length >= 3, 'Minimal 3 karakter'),
    validasi('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email tidak valid'),
    validasi('password', v => v.length >= 8, 'Minimal 8 karakter'),
  ].every(Boolean)
  if (!ok) return
  document.querySelector('#sukses').classList.remove('tersembunyi')
  document.querySelector('#formulir').classList.add('tersembunyi')
})