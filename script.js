document.addEventListener('DOMContentLoaded', () => {
    const MAX_USES = 5;
    const dragDropZone = document.getElementById('dragDropZone');
    const fileInput = document.getElementById('fileInput');
    const statusBar = document.getElementById('statusBar');
    const proBox = document.getElementById('proBox');
    const processingOutput = document.getElementById('processingOutput');

    // Funcții pentru Contor
    const getUseCount = () => {
        const count = localStorage.getItem('cleanseUseCount');
        return count ? parseInt(count) : 0;
    };

    const incrementUseCount = () => {
        let count = getUseCount();
        if (count < MAX_USES) {
            count++;
            localStorage.setItem('cleanseUseCount', count);
        }
        return count;
    };

    const updateStatus = () => {
        const count = getUseCount();
        const remaining = MAX_USES - count;
        
        if (remaining <= 0) {
            statusBar.innerHTML = `<span style="color: var(--pro-border);">Limită atinsă!</span> Treceți la PRO.`;
            dragDropZone.style.pointerEvents = 'none';
            proBox.style.display = 'block';
        } else {
            statusBar.innerHTML = `Utilizări gratuite rămase: <span style="color: var(--accent-color);">${remaining} / ${MAX_USES}</span>`;
            dragDropZone.style.pointerEvents = 'auto';
            proBox.style.display = 'none';
        }
    };
    
    // ----------------------------------------------------
    // Logica de Procesare & Ștergere EXIF
    // ----------------------------------------------------

    const processFile = (file) => {
        if (!file.type || !(file.type.startsWith('image/jpeg') || file.type.startsWith('image/png'))) {
            processingOutput.innerHTML = `<p style="color: red;">Te rog să încarci doar fișiere JPEG sau PNG.</p>`;
            return;
        }

        const currentCount = getUseCount();
        if (currentCount >= MAX_USES) {
            updateStatus();
            return;
        }

        processingOutput.innerHTML = `<p style="color: #ccc;">Procesare imagine: ${file.name}... Ștergere metadate.</p>`;

        // Folosește librăria loadImage (cu opțiunile 'noExif' și 'canvas')
        window.loadImage(
            file,
            (canvas) => {
                if (canvas.type === 'error') {
                    processingOutput.innerHTML = `<p style="color: red;">Eroare la încărcarea imaginii.</p>`;
                    return;
                }

                // Generează un Blob (fișier) din canvas-ul curat
                canvas.toBlob((blob) => {
                    // Crează un URL pentru a putea descărca fișierul curat
                    const url = URL.createObjectURL(blob);
                    const cleanFileName = file.name.replace(/(\.jpe?g|\.png)$/i, '_clean$1');

                    processingOutput.innerHTML = `
                        <p style="color: var(--accent-color);">
                            Succes! Metadate șterse.
                        </p>
                        <a href="${url}" download="${cleanFileName}" class="download-button">
                            Descarcă ${cleanFileName}
                        </a>
                    `;
                    
                    // --- Contorizare de Succes ---
                    incrementUseCount();
                    updateStatus();
                    // ------------------------------
                }, file.type);
            },
            {
                // Opțiuni pentru a ignora metadatele și a genera o nouă imagine curată
                orientation: true, 
                canvas: true,
                noExif: true, // OBLIGATORIU pentru a ignora EXIF
                maxWidth: 1600,
                maxHeight: 1600
            }
        );
    };

    // ----------------------------------------------------
    // Inițializare și Evenimente UI
    // ----------------------------------------------------
    
    dragDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            processFile(e.target.files[0]);
        }
    });

    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.style.backgroundColor = '#2a404e';
    });

    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.style.backgroundColor = 'var(--card-dark)';
    });

    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.style.backgroundColor = 'var(--card-dark)';
        if (e.dataTransfer.files.length) {
            processFile(e.dataTransfer.files[0]);
        }
    });
    
    updateStatus();
});