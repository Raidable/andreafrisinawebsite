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

});