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
                var descText = this.getAttribute('data-description') || ""; 

                if (!videoId) {
                    console.error("Manca data-video-id nell'HTML!");
                    return;
                }

                // B. IMPOSTA VIDEO YOUTUBE
                var youtubeUrl = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&showinfo=0&modestbranding=1";
                if(modalIframe) modalIframe.src = youtubeUrl;

                // C. IMPOSTA TESTI (Solo se gli elementi esistono nell'HTML)
                if (modalTitle) modalTitle.textContent = titleText;
                if (modalDescription) modalDescription.textContent = descText;

                // D. APRI MODALE
                bsModal.show();

                // E. MUTO IL VIDEO HERO (così non si sovrappongono gli audio)
                if (video) {
                    video.muted = true;
                    video.volume = 0;
                    if (slider) slider.value = 0;
                    updateIcon(0);
                }
;
                

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


});