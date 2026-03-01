let allImages = []; // Array globale per navigare tra le foto
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch('../dynamic/photography.json')
        .then(res => res.json())
        .then(data => {
            allImages = [...data.row1, ...data.row2, ...data.row3];

            renderRow('row1', data.row1, 'row-slow');
            renderRow('row2', data.row2, 'row-fast');
            renderRow('row3', data.row3, 'row-mid');
        });

    function renderRow(rowId, images, speedClass) {
        const rowElement = document.getElementById(rowId);
        if (!images || images.length === 0) return;

        // Creiamo il contenuto delle foto
        const photoHTML = images.map(src => `
            <div class="photo-item" onclick="openLightbox('${src}')">
                <img src="${src}" loading="lazy">
            </div>
        `).join('');

        // Iniettiamo due blocchi identici per il loop infinito
        rowElement.innerHTML = `
            <div class="marquee-content ${speedClass}">${photoHTML}</div>
            <div class="marquee-content ${speedClass}">${photoHTML}</div>
        `;
    }
});

function openLightbox(src) {
    // Troviamo la posizione della foto cliccata nell'array globale
    currentIndex = allImages.indexOf(src);
    updateLightboxContent();
    lightbox.classList.add('active');
}

function updateLightboxContent() {
    lightboxImg.src = allImages[currentIndex];
}

function nextImage() {
    currentIndex = (currentIndex + 1) % allImages.length;
    updateLightboxContent();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    updateLightboxContent();
}

// GESTIONE EVENTI (CORRETTA PER LE FRECCE)
document.getElementById('nextBtn').addEventListener('click', (e) => {
    e.stopPropagation(); // Evita che il click arrivi al lightbox (chiudendolo)
    nextImage();
});

document.getElementById('prevBtn').addEventListener('click', (e) => {
    e.stopPropagation(); // Evita che il click arrivi al lightbox (chiudendolo)
    prevImage();
});

document.getElementById('closeLightbox').onclick = () => {
    lightbox.classList.remove('active');
};

// Chiudi solo se clicchi sullo sfondo nero e NON sulle frecce o sull'immagine
lightbox.onclick = (e) => {
    const isArrow = e.target.closest('.lightbox-nav');
    if (e.target !== lightboxImg && !isArrow) {
        lightbox.classList.remove('active');
    }
};

// Supporto Tastiera
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") lightbox.classList.remove('active');
});