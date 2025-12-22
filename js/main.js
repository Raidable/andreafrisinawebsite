document.addEventListener("DOMContentLoaded", function() {

    
    // 1. Selettori Video Hero
    var video = document.getElementById('hero-video');
    var slider = document.getElementById('volumeSlider');
    var icon = document.getElementById('audioIcon');

    // 2. Logica di avvio e Fade-In (Hero Video)
    if (video) {
        video.addEventListener('canplay', function() {
            video.play().then(function() {
                video.classList.add('visible');
            }).catch(function(error) {
                console.error("Autoplay bloccato:", error);
            });
        });

        // Fallback
        if (video.readyState >= 3) {
            video.classList.add('visible');
        }

    video.addEventListener('pause', function() {
                
                // Controlla se la Modale del portfolio è aperta
                var isModalOpen = document.getElementById('videoModal').classList.contains('show');
                
                // Controlla se la pagina è visibile (per non consumare batteria se l'utente cambia scheda)
                var isPageVisible = !document.hidden;

                // SE la modale è CHIUSA e la pagina è VISIBILE...
                if (!isModalOpen && isPageVisible) {
                    console.log("Il video si è fermato (es. PiP chiuso), forzo il riavvio...");
                    
                    // ...FORZA IL PLAY
                    video.play().catch(e => console.error("Impossibile riavviare:", e));
                }
            });
    }

    // 3. Logica Slider Audio
    if (slider && video) {
        slider.addEventListener('input', function() {
            var volumeValue = parseFloat(this.value);
            var volumeDecimal = volumeValue / 100;
            
            video.volume = volumeDecimal;
            
            if (volumeDecimal > 0) {
                video.muted = false;
            } else {
                video.muted = true;
            }
            
            updateIcon(volumeValue);
        });
    }

    // 4. Logica Click Icona (Mute/Unmute)
    if (icon && video) {
        icon.addEventListener('click', function() {
            if (video.muted || video.volume === 0) {
                // UNMUTE
                video.muted = false;
                video.volume = 0.8;
                if(slider) slider.value = 80;
                updateIcon(80);
            } else {
                // MUTE
                video.muted = true;
                video.volume = 0;
                if(slider) slider.value = 0;
                updateIcon(0);
            }
        });
    }

    // 5. Funzione Aggiorna Icona
    function updateIcon(vol) {
        if(!icon) return;
        icon.classList.remove('bi-volume-mute-fill', 'bi-volume-down-fill', 'bi-volume-up-fill');
        
        if (vol <= 0) {
            icon.classList.add('bi-volume-mute-fill');
        } else if (vol < 50) {
            icon.classList.add('bi-volume-down-fill');
        } else {
            icon.classList.add('bi-volume-up-fill');
        }
    }

    // --- 6. LOGICA CAROSELLO PORTFOLIO (NUOVA) ---
    var scrollContainer = document.getElementById('scrollContainer');
    var btnLeft = document.getElementById('scrollLeft');
    var btnRight = document.getElementById('scrollRight');

    if (scrollContainer && btnLeft && btnRight) {
        
        // Distanza di scorrimento (circa larghezza video + spazio)
        var scrollAmount = 500; 

        btnRight.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        btnLeft.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    var videoTriggers = document.querySelectorAll('.video-trigger');
    var modalIframe = document.getElementById('modalVideoIframe');
    var videoModal = document.getElementById('videoModal'); // L'elemento HTML
    var bsModal; // L'istanza Bootstrap del modal

    // Inizializza il modal di Bootstrap se esiste
    if (videoModal) {
        // Usa l'oggetto Bootstrap globale 'bootstrap' caricato dallo script CDN
        bsModal = new bootstrap.Modal(videoModal);

        // A. QUANDO CLICCHI SULLA THUMBNAIL
        videoTriggers.forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                // 1. Prendi l'ID dal data-attribute
                
                var videoId = this.getAttribute('data-video-id');
                var titleText = this.getAttribute('data-title') || ""; // Se manca, metti stringa vuota
                var provider = this.getAttribute('data-provider'); // 'youtube' o 'vimeo'
                var descText = this.getAttribute('data-description') || ""; 

                if (!videoId) {
                    console.error("Manca data-video-id nell'HTML!");
                    return;
                }

                // B. COSTRUISCI URL IN BASE AL PROVIDER
                var finalUrl = "";

                if (provider === 'vimeo') {
                    // URL VIMEO: player.vimeo.com/video/[ID]?autoplay=1
                    finalUrl = "https://player.vimeo.com/video/" + videoId + "?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479";
                } else {
                    // URL YOUTUBE (Default): youtube.com/embed/[ID]?autoplay=1
                    finalUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&showinfo=0&modestbranding=1";
                }

                // C. IMPOSTA IFRAME E TESTI
                if(modalIframe) modalIframe.src = finalUrl;
                if(modalTitle) modalTitle.textContent = titleText;
                if(modalDescription) modalDescription.textContent = descText;

                // D. APRI MODALE E ZITTISCI HERO
                bsModal.show();

                if (video) {
                    video.muted = true;
                    video.volume = 0;
                    if (slider) slider.value = 0;
                    updateIcon(0);
                }
                

            });
        });

        // B. QUANDO CHIUDI LA MODALE (STOP VIDEO)
        // È fondamentale svuotare l'SRC, altrimenti l'audio continua in background!
        videoModal.addEventListener('hidden.bs.modal', function () {
            modalIframe.src = ""; 
            // Pulisci il testo quando chiudi (opzionale, ma pulito)
            modalTitle.textContent = "";
            modalDescription.textContent = "";
        });
    }

    var photoTrack = document.getElementById('photoTrack');
    var photoLeft = document.getElementById('photoLeft');
    var photoRight = document.getElementById('photoRight');

    if (photoTrack && photoLeft && photoRight) {
        
        photoRight.addEventListener('click', function() {
            // Scorre di circa 300px (larghezza foto) + gap
            photoTrack.scrollBy({ left: 320, behavior: 'smooth' });
        });

        photoLeft.addEventListener('click', function() {
            photoTrack.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

// ============================================================
    // 9. ANIMAZIONE FADE SCROLL (QUESTA È LA PARTE CHE MANCAVA)
    // ============================================================
    var faders = document.querySelectorAll('.fade-section');

    if (faders.length > 0 && 'IntersectionObserver' in window) {
        var appearOptions = {
            threshold: 0.15,       // Appare quando il 15% è visibile
            rootMargin: "0px 0px -50px 0px" 
        };

        var appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(function(fader) {
            appearOnScroll.observe(fader);
        });
    } else {
        // Fallback per browser vecchi o se qualcosa va storto: mostra tutto subito
        faders.forEach(function(fader) {
            fader.classList.add('visible');
        });
    }



});