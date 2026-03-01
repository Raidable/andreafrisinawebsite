document.addEventListener("DOMContentLoaded", function() {

    // ============================================================
    // 1. GESTIONE VIDEO HERO (HOMEPAGE)
    // ============================================================
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
        location.reload();
    }
    
    var video = document.getElementById('hero-video');
    var slider = document.getElementById('volumeSlider');
    var icon = document.getElementById('audioIcon');

    if (video) {
        video.muted = true;
        video.volume = 0;
        
        // Avvio e Fade-In
        video.addEventListener('canplay', function() {
            video.play().then(function() {
                video.classList.add('visible');
            }).catch(function(error) {
                console.error("Autoplay bloccato:", error);
            });
        });

        // Fallback se il video è già caricato
        if (video.readyState >= 3) {
            video.classList.add('visible');
        }

        // Logica Smart Pause: Riavvia se si ferma per sbaglio (tranne se c'è una modale aperta)
        video.addEventListener('pause', function() {
            var isModalOpen = document.body.classList.contains('modal-open') || document.querySelector('.modal-custom-backdrop.active');
            var isPageVisible = !document.hidden;

            if (!isModalOpen && isPageVisible) {
                console.log("Il video si è fermato, riavvio...");
                video.play().catch(e => console.error("Impossibile riavviare:", e));
            }
        });

        // Slider Audio
        if (slider) {
            slider.addEventListener('input', function() {
                var volumeValue = parseFloat(this.value);
                var volumeDecimal = volumeValue / 100;
                
                // Applichiamo il volume
                video.volume = volumeDecimal;
                
                if (volumeDecimal > 0) {
                    // FONDAMENTALE: Togliamo il mute sia come proprietà che come attributo HTML
                    video.muted = false;
                    video.removeAttribute('muted');
                    // Alcuni browser richiedono play() dopo lo smontaggio del mute per attivare l'audio
                    video.play().catch(e => console.log("Riproduzione già attiva"));
                } else {
                    video.muted = true;
                }
                
                updateIcon(volumeValue);
            });
        }

        // Click Icona Mute/Unmute
        if (icon) {
            icon.addEventListener('click', function() {
                if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.removeAttribute('muted'); // Rimuoviamo l'attributo fisico
                    video.volume = 0.8;
                    if(slider) slider.value = 80;
                    updateIcon(80);
                    // Forza il play per sbloccare il contesto audio
                    video.play().catch(e => {});
                } else {
                    video.muted = true;
                    video.volume = 0;
                    if(slider) slider.value = 0;
                    updateIcon(0);
                }
            });
        }
    }

    function updateIcon(vol) {
        if(!icon) return;
        icon.classList.remove('bi-volume-mute-fill', 'bi-volume-down-fill', 'bi-volume-up-fill');
        if (vol <= 0) icon.classList.add('bi-volume-mute-fill');
        else if (vol < 50) icon.classList.add('bi-volume-down-fill');
        else icon.classList.add('bi-volume-up-fill');
    }


    // ============================================================
    // 2. LOGICA MODALE VIDEO (UNIVERSALE: BOOTSTRAP + CUSTOM)
    // ============================================================
    var videoTriggers = document.querySelectorAll('.video-trigger');
    
    // Cerchiamo i due tipi di modale
    var bsModalEl = document.getElementById('videoModal'); // Elemento generico
    var customModalEl = document.querySelector('.modal-custom-backdrop'); // Modale Custom (Filmmaking)

    // A. SCENARIO 1: MODALE CUSTOM (Pagina Filmmaking)
    if (customModalEl) {
        
        var modalVideoContainer = document.getElementById('modalVideoContainer');
        var modalTitle = document.getElementById('modalTitle');
        var modalDesc = document.getElementById('modalDesc');
        var closeModalBtn = document.getElementById('closeModal');

        videoTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                var videoId = this.getAttribute('data-video-id');
                var provider = this.getAttribute('data-provider') || 'vimeo';
                var title = this.getAttribute('data-title');
                var desc = this.getAttribute('data-description');

                // Testi
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;

                // URL
                var embedUrl = "";
                if (provider === 'youtube') {
                    embedUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&showinfo=0&modestbranding=1";
                } else {
                    embedUrl = "https://player.vimeo.com/video/" + videoId + "?autoplay=1&color=ffffff&title=0&byline=0&portrait=0";
                }

                // Inietta Iframe
                if(modalVideoContainer) {
                    modalVideoContainer.innerHTML = '<iframe src="' + embedUrl + '" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
                }

                // Mostra Modale Custom
                customModalEl.classList.add('active');
            });
        });

        // Funzione Chiudi Custom
        function closeCustomModal() {
            customModalEl.classList.remove('active');
            setTimeout(function() {
                if(modalVideoContainer) modalVideoContainer.innerHTML = '';
            }, 300);
        }

        if(closeModalBtn) closeModalBtn.addEventListener('click', closeCustomModal);
        
        customModalEl.addEventListener('click', function(e) {
            if (e.target === customModalEl) closeCustomModal();
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && customModalEl.classList.contains('active')) closeCustomModal();
        });
    }

    // B. SCENARIO 2: MODALE BOOTSTRAP (Homepage)
    // (Eseguiamo questo solo se NON c'è la modale custom, per evitare conflitti)
    else if (bsModalEl && typeof bootstrap !== 'undefined') {
        
        var bsModal = new bootstrap.Modal(bsModalEl);
        var modalIframe = document.getElementById('modalVideoIframe');
        var bsTitle = document.getElementById('modalTitle'); // Assumendo che usi questi ID nella home
        var bsDesc = document.getElementById('modalDescription');

        videoTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                var videoId = this.getAttribute('data-video-id');
                var provider = this.getAttribute('data-provider') || 'vimeo';
                var title = this.getAttribute('data-title');
                var desc = this.getAttribute('data-description');

                var embedUrl = "";
                if (provider === 'youtube') {
                    embedUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&showinfo=0&modestbranding=1";
                } else {
                    embedUrl = "https://player.vimeo.com/video/" + videoId + "?autoplay=1&badge=0&autopause=0";
                }

                if(modalIframe) modalIframe.src = embedUrl;
                if(bsTitle) bsTitle.textContent = title;
                if(bsDesc) bsDesc.textContent = desc;

                // Zittisci video hero
                if (video) {
                    video.muted = true;
                    if(slider) slider.value = 0;
                    updateIcon(0);
                }

                bsModal.show();
            });
        });

        bsModalEl.addEventListener('hidden.bs.modal', function () {
            if(modalIframe) modalIframe.src = "";
        });
    }


    // ============================================================
    // 3. SCROLL ORIZZONTALI (PORTFOLIO / FOTO)
    // ============================================================
    
    // Scroll Portfolio (Video)
    var scrollContainer = document.getElementById('scrollContainer');
    var btnLeft = document.getElementById('scrollLeft');
    var btnRight = document.getElementById('scrollRight');

    if (scrollContainer && btnLeft && btnRight) {
        btnRight.addEventListener('click', function() {
            scrollContainer.scrollBy({ left: 500, behavior: 'smooth' });
        });
        btnLeft.addEventListener('click', function() {
            scrollContainer.scrollBy({ left: -500, behavior: 'smooth' });
        });
    }

    // Scroll Foto (Track)
    var photoTrack = document.getElementById('photoTrack');
    var photoLeft = document.getElementById('photoLeft');
    var photoRight = document.getElementById('photoRight');

    if (photoTrack && photoLeft && photoRight) {
        photoRight.addEventListener('click', function() {
            photoTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });
        photoLeft.addEventListener('click', function() {
            photoTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }


    // ============================================================
    // 4. ANIMAZIONE FADE-IN ALLO SCROLL
    // ============================================================
    var faders = document.querySelectorAll('.fade-section');
    if (faders.length > 0 && 'IntersectionObserver' in window) {
        var appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        var appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(function(fader) {
            appearOnScroll.observe(fader);
        });
    } else {
        faders.forEach(function(fader) { fader.classList.add('visible'); });
    }

});