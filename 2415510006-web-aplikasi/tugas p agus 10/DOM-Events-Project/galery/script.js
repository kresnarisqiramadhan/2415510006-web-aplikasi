const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');

filters.forEach(btn => {

    btn.addEventListener('click', () => {

        filters.forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        const cat = btn.dataset.cat;

        cards.forEach(card => {

            const show =
                cat === 'all' ||
                card.dataset.cat === cat;

            card.classList.toggle('hidden', !show);

        });

    });

});