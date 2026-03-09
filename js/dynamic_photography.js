let photoData = {};
let currentImages = []; 
let currentIndex = 0;   

document.addEventListener('DOMContentLoaded', () => {
    // 1. Caricamento del file JSON
    fetch('../dynamic/photography.json') 
        .then(res => {
            if (!res.ok) throw new Error("File JSON non trovato");
            return res.json();
        })
        .then(data => {
            photoData = data;
            
            // 2. Impostazione dinamica delle copertine delle cartelle
            // --- GESTIONE DINAMICA COVER E TITOLI ---
            Object.keys(data).forEach(key => {
                // 1. Cerca le cartelle standard (quelle con openPhotoCategory)
                const cardStandard = document.querySelector(`.folder-card[onclick*="openPhotoCategory('${key}')"]`);
                
                // 2. Cerca la cartella Products (quella con openSubFolder)
                // Usiamo un selettore che cerca l'ID dell'overlay specifico nel caso dei Products
                const cardSubFolder = document.querySelector(`.folder-card[onclick*="openSubFolder('${key}Overlay')"]`);

                const card = cardStandard || cardSubFolder;

                if (card) {
                    // Applica la cover
                    if (data[key].cover) {
                        card.style.backgroundImage = `url('${data[key].cover}')`;
                    }
                    // Applica il titolo (cerca lo span all'interno della card trovata)
                    const titleSpan = card.querySelector('.folder-title');
                    if (titleSpan && data[key].title) {
                        titleSpan.innerText = data[key].title;
                    }
                }
            });

            // 3. Inizializzazione rullini statici (SOPRA e SOTTO)
            if (data.staticTop) {
                renderMarquee('marqueeFoodTop', data.staticTop.images, 'row-slow', 'staticTop');
            }
            if (data.staticBottom) {
                renderMarquee('marqueeLandscapeBottom', data.staticBottom.images, 'row-mid', 'staticBottom');
            }
        })
        .catch(err => console.error("Errore caricamento JSON:", err));

    // 4. Gestione navigazione Lightbox
    document.getElementById('prevBtn').onclick = (e) => { 
        e.stopPropagation(); 
        navigateLightbox(-1); 
    };
    document.getElementById('nextBtn').onclick = (e) => { 
        e.stopPropagation(); 
        navigateLightbox(1); 
    };
    document.getElementById('closeLightbox').onclick = () => {
        document.getElementById('lightbox').classList.remove('active');
    };
});

/**
 * Funzione per renderizzare i rullini (Marquee)
 */
function renderMarquee(containerId, images, speedClass, key) {
    const container = document.getElementById(containerId);
    if (!container || !images || images.length === 0) return;

    // Clonazione per evitare buchi nel nastro
    let displayImages = [...images];
    while (displayImages.length < 10) { 
        displayImages = displayImages.concat(images);
    }

    // Genera l'HTML: usa l'array originale 'images' per il lightbox così la navigazione è coerente
    const html = displayImages.map(src => `
        <div class="photo-item" onclick="openLightbox('${src}', '${key}')">
            <img src="${src}" loading="lazy">
        </div>
    `).join('');

    container.innerHTML = `
        <div class="marquee-content ${speedClass}">${html}</div>
        <div class="marquee-content ${speedClass}">${html}</div>
    `;
}

/**
 * Apertura categoria (Overlay con riga singola)
 */
function openPhotoCategory(key) {
    const cat = photoData[key];
    if (!cat) return;

    const singleRow = document.getElementById('photoRowSingle');
    if (singleRow) singleRow.innerHTML = "";

    const titleElement = document.getElementById('catTitle');
    if (titleElement) titleElement.innerText = cat.title;
    
    // Unisce le foto per la riga singola
    currentImages = cat.images || [...cat.rows.row1, ...cat.rows.row2, ...cat.rows.row3];

    if (currentImages.length > 0) {
        renderMarquee('photoRowSingle', currentImages, 'row-slow', key);
    }

    const overlay = document.getElementById('photoCategoryOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePhotoCategory() {
    document.getElementById('photoCategoryOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Funzione Lightbox
 */
function openLightbox(src, key) {
    // Carica il set di immagini corretto per le frecce
    if (key === 'staticTop') {
        currentImages = photoData.staticTop.images;
    } else if (key === 'staticBottom') {
        currentImages = photoData.staticBottom.images;
    } else if (photoData[key]) {
        // Se il JSON è quello nuovo usa .images, altrimenti unisce le righe
        currentImages = photoData[key].images || [
            ...photoData[key].rows.row1, 
            ...photoData[key].rows.row2, 
            ...photoData[key].rows.row3
        ];
    }
    
    currentIndex = currentImages.indexOf(src);
    if (currentIndex === -1) currentIndex = 0; // Fallback
    
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
}

function updateLightbox() {
    const img = document.getElementById('lightboxImg');
    img.src = currentImages[currentIndex];
}

function navigateLightbox(direction) {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    updateLightbox();
}

function openSubFolder(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    const key = id.replace('Overlay', ''); 
    
    if (photoData[key]) {
        const titleOverlay = overlay.querySelector('.folder-title-overlay');
        if (titleOverlay) {
            titleOverlay.innerText = photoData[key].title;
        }
    }

    overlay.classList.add('active');
    
    // Su PC blocchiamo lo scroll del body
    document.body.style.overflow = 'hidden';
    // Su Mobile aggiungiamo la classe specifica che gestisce meglio il blocco
    document.body.classList.add('no-scroll-mobile');
    
    // Forza lo scroll dell'overlay in cima quando lo apri
    overlay.scrollTop = 0;
}

function closeSubFolder(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}

// Modifica leggermente la chiusura delle foto per sicurezza
function closePhotoCategory() {
    document.getElementById('photoCategoryOverlay').classList.remove('active');
    // Se l'overlay dei prodotti è ancora aperto, non ripristinare lo scroll del body
    if (!document.getElementById('productsOverlay').classList.contains('active')) {
        document.body.style.overflow = '';
    }
}
