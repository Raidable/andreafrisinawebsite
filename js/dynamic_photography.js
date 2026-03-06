let photoData = {};
let currentImages = []; 
let currentIndex = 0;   

document.addEventListener('DOMContentLoaded', () => {
    fetch('../dynamic/photography.json') 
        .then(res => res.json())
        .then(data => {
            photoData = data;
            
            // Inizializza i rullini statici
            if (data.staticTop) {
                renderMarqueeRow('marqueeFoodTop', data.staticTop.images, 'row-slow', 'staticTop');
            }
            if (data.staticBottom) {
                renderMarqueeRow('marqueeLandscapeBottom', data.staticBottom.images, 'row-mid', 'staticBottom');
            }
        })
        .catch(err => console.error("Errore caricamento JSON:", err));

    // Navigazione frecce Lightbox
    document.getElementById('prevBtn').addEventListener('click', (e) => { 
        e.stopPropagation(); 
        navigateLightbox(-1); 
    });
    document.getElementById('nextBtn').addEventListener('click', (e) => { 
        e.stopPropagation(); 
        navigateLightbox(1); 
    });
    document.getElementById('closeLightbox').onclick = () => {
        document.getElementById('lightbox').classList.remove('active');
    };
});

function renderMarqueeRow(containerId, images, speedClass, categoryKey = null) {
    const row = document.getElementById(containerId);
    if (!row || !images || images.length === 0) return;

    const html = images.map(src => `
        <div class="photo-item" onclick="openLightbox('${src}', '${categoryKey}')">
            <img src="${src}" loading="lazy">
        </div>
    `).join('');

    row.innerHTML = `
        <div class="marquee-content ${speedClass}">${html}</div>
        <div class="marquee-content ${speedClass}">${html}</div>
    `;
}

function openPhotoCategory(key) {
    const cat = photoData[key];
    if (!cat) return;
    document.getElementById('catTitle').innerText = cat.title;
    currentImages = [...cat.rows.row1, ...cat.rows.row2, ...cat.rows.row3];
    renderMarqueeRow('photoRow1', cat.rows.row1, 'row-slow', key);
    renderMarqueeRow('photoRow2', cat.rows.row2, 'row-fast', key);
    renderMarqueeRow('photoRow3', cat.rows.row3, 'row-mid', key);
    document.getElementById('photoCategoryOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openLightbox(src, key) {
    if (key === 'staticTop') {
        currentImages = photoData.staticTop.images;
    } else if (key === 'staticBottom') {
        currentImages = photoData.staticBottom.images;
    } else if (photoData[key]) {
        currentImages = [...photoData[key].rows.row1, ...photoData[key].rows.row2, ...photoData[key].rows.row3];
    }
    currentIndex = currentImages.indexOf(src);
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
}

function updateLightbox() {
    document.getElementById('lightboxImg').src = currentImages[currentIndex];
}

function navigateLightbox(direction) {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    updateLightbox();
}

function closePhotoCategory() {
    document.getElementById('photoCategoryOverlay').classList.remove('active');
    document.body.style.overflow = '';
}