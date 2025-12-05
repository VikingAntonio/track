
document.addEventListener('DOMContentLoaded', () => {

    // Set current year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const langToggle = document.getElementById('lang-toggle');
    let currentLang = 'en';

    const plataformas = [
        { id: 'wix', nombreKey: 'platform_wix', img: 'https://static.cdnlogo.com/logos/w/19/wix.svg' },
        { id: 'webflow', nombreKey: 'platform_webflow', img: 'https://static.cdnlogo.com/logos/w/2/webflow.svg' },
        { id: 'wordpress', nombreKey: 'platform_wordpress', img: 'https://static.cdnlogo.com/logos/w/31/wordpress-icon.svg' },
        { id: 'shopify', nombreKey: 'platform_shopify', img: 'https://static.cdnlogo.com/logos/s/4/shopify.svg' },
        { id: 'squarespace', nombreKey: 'platform_squarespace', img: 'https://static.cdnlogo.com/logos/s/87/squarespace.svg' },
        { id: 'otras', nombreKey: 'platform_other', img: 'https://static.cdnlogo.com/logos/o/14/others.svg' }
    ];

    const plataformasGrid = document.querySelector('.plataformas-grid');
    const instruccionesContainer = document.querySelector('#instrucciones .container');
    const plataformaSeleccionadaInput = document.getElementById('plataforma-seleccionada');

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        generatePlatformCards();
        instruccionesContainer.innerHTML = '';
        plataformaSeleccionadaInput.value = '';
    }

    function generatePlatformCards() {
        plataformasGrid.innerHTML = '';
        plataformas.forEach(plataforma => {
            const card = document.createElement('div');
            card.className = 'plataforma-card';
            card.dataset.id = plataforma.id;
            const nombre = translations[currentLang][plataforma.nombreKey] || plataforma.id;
            card.innerHTML = `
                <img src="${plataforma.img}" alt="${nombre}">
                <h3>${nombre}</h3>
            `;
            plataformasGrid.appendChild(card);
        });
    }

    langToggle.addEventListener('change', () => {
        setLanguage(langToggle.checked ? 'es' : 'en');
    });

    setLanguage('en');

    plataformasGrid.addEventListener('click', e => {
        const card = e.target.closest('.plataforma-card');
        if (!card) return;

        const plataformaId = card.dataset.id;
        
        document.querySelectorAll('.plataforma-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const tituloKey = `instr_${plataformaId}_title`;
        const pasos = [];
        for (let i = 1; i <= 4; i++) {
            const pasoKey = `instr_${plataformaId}_${i}`;
            if (translations[currentLang][pasoKey]) {
                pasos.push(translations[currentLang][pasoKey]);
            }
        }

        let panelHTML = `
            <div class="instrucciones-panel">
                <h3>${translations[currentLang][tituloKey]}</h3>
                <ol>
                    ${pasos.map(paso => `<li>${paso}</li>`).join('')}
                </ol>
                <p>${translations[currentLang]['instructions_email_prompt']}</p>
                <div class="email-box" title="Copiar al portapapeles">${'francisco.menutech@gmail.com'}</div>
                <a href="#" target="_blank" class="btn" style="margin-top: 1.5rem;">${translations[currentLang]['instructions_go_to_panel']}</a>
            </div>
        `;
        instruccionesContainer.innerHTML = panelHTML;
        instruccionesContainer.querySelector('.instrucciones-panel').style.display = 'block';

        // Handle the "Other" platform case
        if (plataformaId === 'otras') {
            plataformaSeleccionadaInput.value = '';
            plataformaSeleccionadaInput.readOnly = false;
            plataformaSeleccionadaInput.placeholder = translations[currentLang]['form_placeholder_other_platform'];
            plataformaSeleccionadaInput.focus();
        } else {
            plataformaSeleccionadaInput.value = translations[currentLang][plataformas.find(p => p.id === plataformaId).nombreKey];
            plataformaSeleccionadaInput.readOnly = true;
            plataformaSeleccionadaInput.placeholder = '';
        }
        
        document.getElementById('instrucciones').scrollIntoView({ behavior: 'smooth' });
    });

    instruccionesContainer.addEventListener('click', e => {
        if (e.target.classList.contains('email-box')) {
            navigator.clipboard.writeText('francisco.menutech@gmail.com').then(() => {
                const toast = document.createElement('div');
                toast.textContent = translations[currentLang]['copy_toast_text'];
                toast.className = 'copy-toast';
                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('show'), 10);
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.addEventListener('transitionend', () => toast.remove());
                }, 2500);
            }).catch(err => {
                console.error('Error copying email: ', err);
            });
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section:not(.new-form-design) > .container > *').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- New Form Logic ---
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success-message');
    const contactCard = document.querySelector('.contact');
    const statusPopup = document.getElementById('status-popup');
    const popupMessage = document.getElementById('popup-message');
    const popupSpinner = document.getElementById('popup-spinner');
    const popupClose = document.getElementById('popup-close');

    function showPopup(state) {
        const lang = currentLang;
        popupSpinner.style.display = 'block';

        if (state === 'sending') {
            popupMessage.textContent = translations[lang]['form_popup_sending'];
            popupClose.style.display = 'none';
        } else if (state === 'error') {
            popupSpinner.style.display = 'none';
            popupMessage.textContent = translations[lang]['form_popup_error'];
            popupClose.style.display = 'block';
        }
        statusPopup.classList.add('visible');
    }

    function hidePopup() {
        statusPopup.classList.remove('visible');
    }

    popupClose.addEventListener('click', hidePopup);
    statusPopup.addEventListener('click', (e) => {
        if (e.target === statusPopup) {
            hidePopup();
        }
    });

    function threeD(e) {
      const x = e.clientX;
      const y = e.clientY;
      const middleX = window.innerWidth / 2;
      const middleY = window.innerHeight / 2;
      const offsetX = ((x - middleX) / middleX) * 10;
      const offsetY = ((y - middleY) / middleY) * 10;
      contactCard.style.setProperty('--rotateX', -1 * offsetY + 'deg');
      contactCard.style.setProperty('--rotateY', offsetX + 'deg');
    }

    document.addEventListener('mousemove', threeD);

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const scriptURL = typeof SCRIPT_URL !== 'undefined' ? SCRIPT_URL : '';
        if (!scriptURL || scriptURL === 'URL_DE_TU_WEB_APP_DE_GOOGLE_AQUÍ') {
            console.error('Error: Script URL is not configured in js/config.js');
            alert('Configuration error: The data submission URL is not defined.');
            return;
        }

        showPopup('sending');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-Type": "text/plain;charset=utf-8" },
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                hidePopup();
                setTimeout(() => {
                    contactCard.classList.add('sent');
                    successMessage.classList.add('visible'); // Show the success message
                }, 300); // Small delay to allow popup to animate out
                
                setTimeout(() => {
                    contactCard.classList.remove('sent');
                    successMessage.classList.remove('visible'); // Hide the success message
                    form.reset();
                    submitButton.disabled = false;
                }, 4000);
            } else {
                throw new Error(data.message || 'Server error.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            showPopup('error');
            submitButton.disabled = false;
        });
    });
});
