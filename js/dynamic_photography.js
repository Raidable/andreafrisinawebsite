document.addEventListener('DOMContentLoaded', () => {
    fetch('../dynamic/photography.json')
        .then(res => res.json())
        .then(data => {
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

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
}
document.getElementById('closeLightbox').onclick = () => lightbox.classList.remove('active');
lightbox.onclick = (e) => { if(e.target !== lightboxImg) lightbox.classList.remove('active'); }