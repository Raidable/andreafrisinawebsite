        document.addEventListener('DOMContentLoaded', function() {
            
            // --- 1. GESTIONE MODALE ---
            const modal = document.getElementById('videoModal');
            const videoContainer = document.getElementById('modalVideoContainer');
            const modalTitle = document.getElementById('modalTitle');
            const modalDesc = document.getElementById('modalDesc');
            const closeModalBtn = document.getElementById('closeModal');
            const triggers = document.querySelectorAll('.video-trigger');

            triggers.forEach(trigger => {
                trigger.addEventListener('click', function() {
                    const videoId = this.getAttribute('data-video-id');
                    const provider = this.getAttribute('data-provider') || 'vimeo';
                    const title = this.getAttribute('data-title');
                    const desc = this.getAttribute('data-description');

                    modalTitle.textContent = title;
                    modalDesc.textContent = desc;

                    let embedUrl = '';
                    if (provider === 'vimeo') {
                        embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
                    } else if (provider === 'youtube') {
                        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
                    }

                    videoContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
                    modal.classList.add('active');
                });
            });

            function closeModal() {
                modal.classList.remove('active');
                setTimeout(() => { videoContainer.innerHTML = ''; }, 300);
            }
            if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
            if(modal) modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });


            // --- 2. LOGICA SCROLL INIZIALE (CENTRATO) ---
            function centerCarousels() {
                // Solo su Mobile
                if (window.innerWidth < 992) {
                    
                    // A. CENTRA VERTICALI (Come richiesto)
                    const vCarousel = document.getElementById('verticalCarousel');
                    if (vCarousel) {
                        const firstCardV = vCarousel.querySelector('.col-6');
                        if (firstCardV) {
                            // Larghezza carta + Gap (circa 24px per g-4)
                            vCarousel.scrollLeft = firstCardV.offsetWidth + 24; 
                        }
                    }

                    // B. CENTRA ORIZZONTALI (NUOVA RICHIESTA)
                    const hCarousel = document.getElementById('horizontalCarousel');
                    if (hCarousel) {
                        const firstCardH = hCarousel.querySelector('.col-12'); // In orizzontale sono col-12 su mobile
                        if (firstCardH) {
                            // Larghezza carta + Gap (circa 48px per g-5)
                            hCarousel.scrollLeft = firstCardH.offsetWidth + 48;
                        }
                    }
                }
            }

            // Esegui subito e dopo il caricamento delle immagini
            centerCarousels();
            window.addEventListener('load', centerCarousels);

        });