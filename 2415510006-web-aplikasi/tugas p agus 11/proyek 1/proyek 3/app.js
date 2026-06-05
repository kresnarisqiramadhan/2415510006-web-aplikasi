function gantiTab(idPanel) {
  document.querySelectorAll('.panel, .tombol-tab')
    .forEach(el => el.classList.remove('aktif'));
  document.querySelector('#' + idPanel).classList.add('aktif');
  document.querySelector(`[data-tab='${idPanel}']`).classList.add('aktif');
}

document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab));
});

function jalankanPenghitung() {
  document.querySelectorAll('.kartu-stat').forEach(kartu => {
    const el = kartu.querySelector('.penghitung');
    const target = +kartu.dataset.target;
    let n = 0;
    const langkah = target / 60;
    const jalankan = () => {
      n = Math.min(n + langkah, target);
      el.textContent = Math.floor(n).toLocaleString();
      if (n < target) requestAnimationFrame(jalankan);
    };
    requestAnimationFrame(jalankan);
  });
}

jalankanPenghitung();

document.querySelectorAll('.judul-akordion').forEach(tombol => {
  tombol.addEventListener('click', () => {
    tombol.closest('.item-akordion').classList.toggle('terbuka');
  });
});

function terapkanTema(gelap) {
  document.body.classList.toggle('gelap', gelap);
  const teks = gelap ? ' Mode Terang' : ' Mode Gelap';
  document.querySelector('#theme-btn').textContent = teks;
}

if (localStorage.getItem('tema') === 'gelap') terapkanTema(true);

document.querySelector('#theme-btn').addEventListener('click', () => {
  const gelap = !document.body.classList.contains('gelap');
  terapkanTema(gelap);
  localStorage.setItem('tema', gelap ? 'gelap' : 'terang');
});

document.querySelector('#theme-btn-2').addEventListener('click', () => {
  const gelap = !document.body.classList.contains('gelap');
  terapkanTema(gelap);
  localStorage.setItem('tema', gelap ? 'gelap' : 'terang');
});