const popup = document.getElementById('popupPage');
const iframe = document.getElementById('popupIframe');
const closeBtn = document.querySelector('.closeBtn');

// Selecciona todos los model-viewer de la página
const modelViewers = document.querySelectorAll('model-viewer');

// Recorre cada model-viewer y escucha los clicks en sus hotspots
modelViewers.forEach(viewer => {
  viewer.addEventListener('click', (event) => {
    if (event.target.classList.contains('Hotspot')) {
      const url = event.target.dataset.url;
      if (!url) return;
      iframe.src = url;
      popup.style.display = 'flex';
    }
  });
});

// Cerrar con X
closeBtn.addEventListener('click', () => {
  iframe.src = '';
  popup.style.display = 'none';
});

// Cerrar al hacer click fuera del contenido
popup.addEventListener('click', e => {
  if (e.target === popup) {
    iframe.src = '';
    popup.style.display = 'none';
  }
});

