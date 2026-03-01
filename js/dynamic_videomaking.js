document.addEventListener('DOMContentLoaded', function() {
    fetch('../dynamic/videomaking.json')
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('.video-grid').forEach(grid => {
                const cat = grid.getAttribute('data-category');
                if (data[cat]) {
                    grid.innerHTML = data[cat].map(v => {
                        let thumb = v.type === 'youtube' ? `https://img.youtube.com/vi/${v.id}/${v.thumb || 'hqdefault'}.jpg` : v.poster;
                        
                        // Generazione URL per link esterni
                        const externalUrl = v.type === 'youtube' ? `https://www.youtube.com/watch?v=${v.id}` : `https://vimeo.com/${v.id}`;

                        if (v.external_link && v.type !== 'local') {
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
                                    <div class="video-title-grid" style="font-family: Montserrat; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #fff; margin-top: 10px; text-align: center; opacity: 0.8;">
                                        ${v.title} <i class="bi bi-box-arrow-up-right small"></i>
                                    </div>
                                </a>
                            </div>`;
                        } else {
                            return `
                            <div class="col-12 col-md-6 col-lg-4 mb-4">
                                <div class="video-trigger" style="cursor:pointer;" data-provider="${v.type}" data-src="${v.src || ''}" data-id="${v.id || ''}" data-aspect="${v.aspect || '16x9'}">
                                    <div class="ratio ratio-16x9" style="background-color: #111; border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                        <img src="${thumb}" style="object-fit:cover; width:100%; height:100%;">
                                        <div class="play-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center;">
                                            <div class="play-button-circle" style="background: rgba(255,255,255,0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 1px solid white;">
                                                <i class="bi bi-play-fill" style="font-size: 2rem; color: white;"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="video-title-grid" style="font-family: Montserrat; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #fff; margin-top: 10px; text-align: center; opacity: 0.8;">
                                        ${v.title}
                                    </div>
                                </div>
                            </div>`;
                        }
                    }).join('');
                }
            });
            initModals();
        });

    function initModals() {
        document.querySelectorAll('.video-trigger').forEach(btn => {
            btn.onclick = function() {
                const container = document.getElementById('modalVideoContainer');
                const aspect = this.getAttribute('data-aspect');
                const provider = this.getAttribute('data-provider');
                let style = (aspect === '9x16') ? 'height:85vh; aspect-ratio:9/16;' : 'width:80vw; aspect-ratio:16/9; max-width:1100px;';
                
                if (provider === 'local') {
                    container.innerHTML = `<div class="local-video-frame" style="${style}; border: 1px solid #444; border-radius: 8px; overflow: hidden; background: #000;"><video controls autoplay src="${this.getAttribute('data-src')}" style="width:100%; height:100%; object-fit:cover;"></video></div>`;
                } else if (provider === 'youtube') {
                    container.innerHTML = `<div class="ratio ratio-16x9" style="${style}"><iframe src="https://www.youtube.com/embed/${this.getAttribute('data-id')}?autoplay=1&rel=0&modestbranding=1" allowfullscreen></iframe></div>`;
                } else if (provider === 'vimeo') {
                    container.innerHTML = `<div class="ratio ratio-16x9" style="${style}"><iframe src="https://player.vimeo.com/video/${this.getAttribute('data-id')}?autoplay=1" allowfullscreen></iframe></div>`;
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