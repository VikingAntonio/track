document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('popup-overlay');
    const iframe  = document.getElementById('popup-iframe');
    const closeBtn = document.getElementById('popup-close');

    // Abrir popup al hacer click en cualquier video con clase video-popup
    document.querySelectorAll('.video-popup').forEach(video => {
        video.addEventListener('click', () => {
            const url = video.dataset.url;
            iframe.src = url;
            overlay.style.display = 'flex';
        });
    });

    // Cerrar popup
    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        iframe.src = ''; // Limpia el iframe
    });

    // Cerrar si se hace click fuera del contenido
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            iframe.src = '';
        }
    });
});

