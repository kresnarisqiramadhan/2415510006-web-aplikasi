if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
  document.querySelector('#theme-btn').textContent = ' Mode Terang';
}

document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');
  const d = document.body.classList.contains('gelap');
  localStorage.setItem('tema', d ? 'gelap' : 'terang');
  document.querySelector('#theme-btn').textContent = d ? ' Mode Terang' : ' Mode Gelap';
});

document.querySelectorAll('.penghitung').forEach(el => {
  const target = +el.dataset.target;
  let n = 0;
  const langkah = target / 60;
  const jalankan = () => {
    n = Math.min(n + langkah, target);
    el.textContent = Math.floor(n).toLocaleString();
    if (n < target) requestAnimationFrame(jalankan);
  };
  requestAnimationFrame(jalankan);
});
