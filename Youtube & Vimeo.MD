# andreafrisinawebsite
Mentre per YouTube esiste un "link magico" che genera l'immagine in automatico, per Vimeo NON esiste. 
Vimeo protegge le immagini e non permette di ottenere la thumbnail solo scrivendo l'ID nell'URL.

Ecco come devi fare per ottenere l'immagine (src) nei due casi:
1. Se il video è di YouTube (Automatico)

È facilissimo. Prendi l'ID del video (quello dopo v=) e lo metti in questo link standard:

    Pattern: https://img.youtube.com/vi/[ID_DEL_TUO_VIDEO]/maxresdefault.jpg

    Esempio: Se l'ID è RIVR6M7Tb50: <img src="https://img.youtube.com/vi/RIVR6M7Tb50/maxresdefault.jpg" ...>

Vimeo non ti dà un link diretto pubblico. Hai due strade:
Opzione A: Il metodo "Fai da te" (Consigliato per Portfoli)

Dato che sei un Director of Photography, probabilmente vuoi che la copertina sia perfetta.

    Apri il video su Vimeo o sul tuo computer.

    Mettilo a tutto schermo e cerca il fotogramma perfetto.

    Fai uno Screenshot (Cattura Schermo).

    Salva l'immagine nella cartella del tuo sito (es. dentro img/ chiamandola project-vimeo.jpg).

    Usa quel percorso nel codice.

Opzione B: Usare un tool online per scaricarla

Se vuoi esattamente quella che c'è su Vimeo:

    Vai su un sito come vimeo-thumbnail.com.

    Incolla il link del tuo video Vimeo.

    Scarica l'immagine che ti trova.

    Mettila nella cartella del tuo sito.

Nel tuo index.html, dovrai gestire i due casi così:

<div class="scroll-item">
    <div class="video-trigger" 
         data-video-id="RIVR6M7Tb50" 
         data-provider="youtube" 
         data-title="Commercial YouTube">
        
        <div class="ratio ratio-16x9 video-thumb-wrapper">
            <img src="https://img.youtube.com/vi/RIVR6M7Tb50/maxresdefault.jpg" class="video-thumb">
            <div class="play-overlay"><i class="bi bi-play-circle"></i></div>
        </div>
    </div>
    <div class="video-title">Lavoro YouTube</div>
</div>

<div class="scroll-item">
    <div class="video-trigger" 
         data-video-id="123456789" 
         data-provider="vimeo" 
         data-title="Commercial Vimeo">
        
        <div class="ratio ratio-16x9 video-thumb-wrapper">
            <img src="../img/copertina-vimeo-1.jpg" class="video-thumb">
            <div class="play-overlay"><i class="bi bi-play-circle"></i></div>
        </div>
    </div>
    <div class="video-title">Lavoro Vimeo</div>
</div>

Ho usato https://www.softr.io/tools/download-vimeo-thumbnail