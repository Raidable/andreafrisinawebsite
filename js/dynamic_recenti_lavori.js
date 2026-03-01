document.addEventListener('DOMContentLoaded', function() {
    // 1. Caricamento Lavori Recenti
    fetch('../dynamic/lavori_recenti.json')
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('recent-works-grid');
            if (grid) {
                grid.innerHTML = data.slice(0, 3).map(v => {
                    let thumb = v.type === 'youtube' ? `https://img.youtube.com/vi/${v.id}/${v.thumb || 'hqdefault'}.jpg` : v.poster;
                    
                    // URL per il link esterno
                    const externalUrl = v.type === 'youtube' 
                        ? `https://www.youtube.com/watch?v=${v.id}` 
                        : `https://vimeo.com/${v.id}`;

                    // Se external_link è true, generiamo un tag <a>
                    if (v.external_link) {
                        return `
                        <div class="col-12 col-md-6 col-lg-4">
                            <a href="${externalUrl}" target="_blank" style="text-decoration:none; color:inherit;">
                                <div class="video-thumb-container">
                                    <div class="ratio ratio-16x9 video-thumb-wrapper rounded-video">
                                        <img src="${thumb}" class="video-thumb" style="object-fit:cover;">
                                        <div class="play-overlay"><i class="bi bi-box-arrow-up-right"></i></div>
                                    </div>
                                </div>
                            </a>
                            <div class="video-title text-center mt-2">${v.title}</div>
                        </div>`;
                    } else {
                        // Altrimenti generiamo il div trigger per la modale
                        return `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="video-trigger" 
                                 style="cursor:pointer;"
                                 data-id="${v.id}" 
                                 data-provider="${v.type}" 
                                 data-title="${v.title}" 
                                 data-description="${v.description}">
                                <div class="ratio ratio-16x9 video-thumb-wrapper rounded-video">
                                    <img src="${thumb}" class="video-thumb" style="object-fit:cover;">
                                    <div class="play-overlay"><i class="bi bi-play-circle"></i></div>
                                </div>
                            </div>
                            <div class="video-title text-center mt-2">${v.title}</div>
                        </div>`;
                    }
                }).join('');
                
                setupHomeModals();
            }
        });

    // 2. Logica Modale Home
    function setupHomeModals() {
        const modalEl = document.getElementById('videoModal');
        if (!modalEl) return;

        const modal = new bootstrap.Modal(modalEl);
        const iframe = document.getElementById('modalVideoIframe');
        const title = document.getElementById('modalTitle');
        const desc = document.getElementById('modalDescription');

        document.querySelectorAll('.video-trigger').forEach(btn => {
            btn.onclick = function() {
                const id = this.getAttribute('data-id');
                const provider = this.getAttribute('data-provider');
                
                if (title) title.innerText = this.getAttribute('data-title');
                if (desc) desc.innerText = this.getAttribute('data-description');

                if (provider === 'youtube') {
                    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
                } else {
                    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1`;
                }
                modal.show();
            };
        });

        // Pulisci l'iframe quando si chiude la modale per fermare il video
        modalEl.addEventListener('hidden.bs.modal', function () {
            if (iframe) iframe.src = '';
        });
    }
});