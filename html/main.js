var iframe = document.querySelector('#vimeo-player');
var player = new Vimeo.Player(iframe);
var slider = document.getElementById('volumeSlider');
var icon = document.getElementById('audioIcon');

player.setVolume(0);

// Mostra il video solo quando è pronto
player.on('play', function() {
    iframe.classList.add('loaded');
});

player.play().catch(function(e) { console.log("Autoplay blocked"); });

// Slider logic
slider.addEventListener('input', function() {
    var volume = parseFloat(this.value);
    player.setVolume(volume);
    updateIcon(volume);
});

// Click icon logic
function toggleMute() {
    player.getVolume().then(function(vol) {
        if (vol === 0) {
            player.setVolume(0.8);
            slider.value = 0.8;
            updateIcon(0.8);
        } else {
            player.setVolume(0);
            slider.value = 0;
            updateIcon(0);
        }
    });
}

function updateIcon(vol) {
    icon.classList.remove('bi-volume-mute-fill', 'bi-volume-down-fill', 'bi-volume-up-fill');
    if (vol === 0) {
        icon.classList.add('bi-volume-mute-fill');
    } else if (vol < 0.5) {
        icon.classList.add('bi-volume-down-fill');
    } else {
        icon.classList.add('bi-volume-up-fill');
    }
}