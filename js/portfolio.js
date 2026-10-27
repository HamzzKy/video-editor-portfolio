document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('allPortfolioGrid');
    const modal = document.getElementById('allVideoModal');
    const frame = document.getElementById('allVideoFrame');
    const close = document.getElementById('closeAllVideo');
    const buttons = document.querySelectorAll('.all-portfolio-filter .filter-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            grid.querySelectorAll('.portfolio-item').forEach(item => {
                item.hidden = filter !== 'all' && item.dataset.category !== filter;
            });
        });
    });

    grid.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            frame.src = `https://www.youtube.com/embed/${item.dataset.video}?autoplay=1`;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        frame.src = '';
    }

    close.addEventListener('click', closeModal);
    modal.addEventListener('click', event => {
        if (event.target === modal) closeModal();
    });
});
