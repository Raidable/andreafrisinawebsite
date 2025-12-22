document.addEventListener("DOMContentLoaded", function() {

    // 1. Selettori
    var video = document.getElementById('hero-video');
    var slider = document.getElementById('volumeSlider');
    var icon = document.getElementById('audioIcon');

    // 2. Logica di avvio e Fade-In
    // Quando il video ha caricato abbastanza dati per partire
    video.addEventListener('canplay', function() {
        video.play().then(function() {
            // Appena parte il play, aggiungiamo la classe visible
            video.classList.add('visible');
        }).catch(function(error) {
            console.error("Autoplay bloccato:", error);
            // Se autoplay è bloccato, mostriamo i controlli o un bottone play (opzionale)
            // video.controls = true; 
        });
    });

    // Fallback: se 'canplay' è già scattato, controlliamo se sta andando
    if (video.readyState >= 3) {
        video.classList.add('visible');
    }

    // 3. Logica Slider Audio
    if (slider) {
        slider.addEventListener('input', function() {
            // HTML5 video volume va da 0.0 a 1.0
            // Lo slider va da 0 a 100
            var volumeValue = parseFloat(this.value);
            var volumeDecimal = volumeValue / 100;
            
            video.volume = volumeDecimal;
            
            // Gestione Mute
            if (volumeDecimal > 0) {
                video.muted = false;
            } else {
                video.muted = true;
            }
            
            updateIcon(volumeValue);
        });
    }

    // 4. Logica Click Icona (Mute/Unmute)
    if (icon) {
        icon.addEventListener('click', function() {
            if (video.muted || video.volume === 0) {
                // UNMUTE -> Porta a 80%
                video.muted = false;
                video.volume = 0.8;
                slider.value = 80;
                updateIcon(80);
            } else {
                // MUTE
                video.muted = true;
                video.volume = 0;
                slider.value = 0;
                updateIcon(0);
            }
        });
    }

    // 5. Aggiorna grafica Icona
    function updateIcon(vol) {
        icon.classList.remove('bi-volume-mute-fill', 'bi-volume-down-fill', 'bi-volume-up-fill');
        
        if (vol <= 0) {
            icon.classList.add('bi-volume-mute-fill');
        } else if (vol < 50) {
            icon.classList.add('bi-volume-down-fill');
        } else {
            icon.classList.add('bi-volume-up-fill');
        }
    }
});