document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('shatter-text');
    if (!textElement) return;

    // 1. Dividi il testo in singoli caratteri (mantenendo gli spazi)
    const text = textElement.innerText;
    textElement.innerHTML = text.split('').map(char => {
        return char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`;
    }).join('');

    const spans = textElement.querySelectorAll('span');

    // 2. Funzione di animazione allo scroll
    window.addEventListener('scroll', () => {
        const rect = textElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calcola quanto l'elemento è fuori dalla visuale superiore
        // 0 = l'elemento è al centro/basso, 1 = l'elemento è quasi uscito in alto
        let scrollFraction = (windowHeight * 0.5 - rect.top) / (windowHeight * 0.5);
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));

        spans.forEach((span, index) => {
            // Direzioni casuali per ogni lettera basate sull'indice
            const x = (index - spans.length / 2) * scrollFraction * 50;
            const y = scrollFraction * -100; // Salgono verso l'alto
            const z = scrollFraction * 200;  // Vengono verso la camera
            const rotate = (index - spans.length / 2) * scrollFraction * 20;
            const blur = scrollFraction * 10;
            const opacity = 1 - scrollFraction;

            span.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotate(${rotate} defense)`;
            span.style.filter = `blur(${blur}px)`;
            span.style.opacity = opacity;
        });
    });
});