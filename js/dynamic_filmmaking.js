document.addEventListener('DOMContentLoaded', function() {
    fetch('../dynamic/filmmaking.json')
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('.video-grid').forEach(grid => {
                const cat = grid.getAttribute('data-category');
                if (data[cat]) {
                    grid.innerHTML = data[cat].map(v => {
                        let thumb = v.type === 'youtube' ? `https://img.youtube.com/vi/${v.id}/${v.thumb || 'hqdefault'}.jpg` : v.poster;
                        const externalUrl = v.type === 'youtube' ? `https://www.youtube.com/watch?v=${v.id}` : `https://vimeo.com/${v.id}`;

                        if (v.external_link) {
                            return `
                            <div class="col-12 col-md-6 col-lg-4 mb-4">
                                <a href="${externalUrl}" target="_blank" style="text-decoration:none; color:inherit;">
                                    <div class="ratio ratio-16x9" style="background-color: #111; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                        <img src="${thumb}" style="object-fit:cover; width:100%; height:100%;">
                                        <div class="play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                                            <div class="play-button-circle" style="background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 1px solid white;">
                                                <i class="bi bi-box-arrow-up-right" style="font-size: 1.5rem; color: white;"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="video-title text-center mt-3" style="font-family: Montserrat; text-transform:uppercase; color:white; font-size:0.85rem; letter-spacing:1px; opacity: 0.8;">
                                        ${v.title} <i class="bi bi-box-arrow-up-right small"></i>
                                    </div>
                                </a>
                            </div>`;
                        } else {
                            return `
                            <div class="col-12 col-md-6 col-lg-4 mb-4">
                                <div class="video-trigger" style="cursor:pointer;" 
                                     data-provider="${v.type}" data-id="${v.id}" 
                                     data-title="${v.title}" data-desc="${v.description || ''}" 
                                     data-aspect="${v.aspect || '16x9'}">
                                    <div class="ratio ratio-16x9" style="background-color: #111; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                        <img src="${thumb}" style="object-fit:cover; width:100%; height:100%;">
                                        <div class="play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                                            <div class="play-button-circle" style="background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 1px solid white;">
                                                <i class="bi bi-play-fill" style="font-size: 2rem; color: white;"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="video-title text-center mt-3" style="font-family: Montserrat; text-transform:uppercase; color:white; font-size:0.85rem; letter-spacing:1px; opacity: 0.8;">
                                        ${v.title}
                                    </div>
                                </div>
                            </div>`;
                        }
                    }).join('');
                }
            });
            initFilmmakingModals();
        });

    function initFilmmakingModals() {
        document.querySelectorAll('.video-trigger').forEach(btn => {
            btn.onclick = function() {
                const container = document.getElementById('modalVideoContainer');
                const aspect = this.getAttribute('data-aspect');
                const provider = this.getAttribute('data-provider');
                const id = this.getAttribute('data-id');
                
                document.getElementById('modalTitle').innerText = this.getAttribute('data-title');
                document.getElementById('modalDesc').innerText = this.getAttribute('data-desc');

                let style = (aspect === '9x16') ? 'height:75vh; aspect-ratio:9/16;' : 'width:80vw; aspect-ratio:16/9; max-width:1100px;';
                
                if (provider === 'youtube') {
                    container.innerHTML = `<div class="ratio ratio-16x9" style="${style}"><iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" allowfullscreen></iframe></div>`;
                } else if (provider === 'vimeo') {
                    container.innerHTML = `<div class="ratio ratio-16x9" style="${style}"><iframe src="https://player.vimeo.com/video/${id}?autoplay=1" allowfullscreen></iframe></div>`;
                }
                
                document.getElementById('videoModal').classList.add('active');
            };
        });
    }

    document.getElementById('closeModal').onclick = () => {
        document.getElementById('videoModal').classList.remove('active');
        document.getElementById('modalVideoContainer').innerHTML = '';
    };
});