function validasi(id, aturan, pesan) {
  const el  = document.querySelector('#' + id);
  const err = el.nextElementSibling;
  const lulus = aturan(el.value.trim());
  el.classList.toggle('valid', lulus);
  el.classList.toggle('invalid', !lulus && el.value !== '');
  if (err && err.classList.contains('pesan-error')) {
    err.textContent = lulus ? '' : pesan;
  }
  return lulus;
}

document.querySelector('#nama').addEventListener('input', () =>
  validasi('nama', v => v.length >= 3, 'Minimal 3 karakter')
);

document.querySelector('#email').addEventListener('input', () =>
  validasi('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email tidak valid')
);

document.querySelector('#password').addEventListener('input', e => {
  validasi('password', v => v.length >= 8, 'Minimal 8 karakter');

  const pct   = Math.min(e.target.value.length / 12 * 100, 100);
  const isian = document.querySelector('.isian');
  const label = document.querySelector('.label-kekuatan');

  isian.style.width = pct + '%';

  if (pct < 40) {
    isian.style.background = '#e54b5a';
    label.textContent = ' Lemah';
    label.style.color = '#e54b5a';
  } else if (pct < 75) {
    isian.style.background = '#ff9933';
    label.textContent = '🔶 Sedang';
    label.style.color = '#ff9933';
  } else {
    isian.style.background = '#27c467';
    label.textContent = ' Kuat';
    label.style.color = '#27c467';
  }
});

document.querySelector('#formulir').addEventListener('submit', e => {
  e.preventDefault();
  const semuaValid = [
    validasi('nama',     v => v.length >= 3,        'Min. 3 karakter'),
    validasi('email',    v => /\S+@\S+/.test(v),    'Email tidak valid'),
    validasi('password', v => v.length >= 8,        'Min. 8 karakter'),
  ].every(Boolean);

  if (!semuaValid) return;

  document.querySelector('#sukses').classList.remove('tersembunyi');
  document.querySelector('#formulir').classList.add('tersembunyi');
});
