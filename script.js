document.addEventListener('DOMContentLoaded', () => {
    const MAX_USES = 5;
    const dragDropZone = document.getElementById('dragDropZone');
    const fileInput = document.getElementById('fileInput');
    const statusBar = document.getElementById('statusBar');
    const proBox = document.getElementById('proBox');
    const processingOutput = document.getElementById('processingOutput');

    // Funcție pentru a citi contorul din localStorage
    const getUseCount = () => {
        const count = localStorage.getItem('cleanseUseCount');
        return count ? parseInt(count) : 0;
    };

    // Funcție pentru a actualiza contorul în localStorage
    const incrementUseCount = () => {
        let count = getUseCount();
        if (count < MAX_USES) {
            count++;
            localStorage.setItem('cleanseUseCount', count);
        }
        return count;
    };

    // Funcție pentru a actualiza vizual contorul în UI
    const updateStatus = () => {
        const count = getUseCount();
        const remaining = MAX_USES - count;
        
        if (remaining <= 0) {
            statusBar.innerHTML = `<span style="color: red;">Limită atinsă!</span> Treceți la PRO.`;
            dragDropZone.style.pointerEvents = 'none'; // Dezactivează zona de drop/click
            proBox.style.display = 'block'; // Arată caseta de plată
        } else {
            statusBar.innerHTML = `Utilizări gratuite rămase: <span style="color: #008060;">${remaining} / ${MAX_USES}</span>`;
            dragDropZone.style.pointerEvents = 'auto'; // Activează zona
            proBox.style.display = 'none'; // Ascunde caseta de plată
        }
    };
    
    // ----------------------------------------------------
    // Logica de Procesare & Contorizare (Simulare)
    // ----------------------------------------------------

    const processFile = (file) => {
        if (file.type && !file.type.startsWith('image/')) {
            alert('Te rog să încarci doar fișiere imagine.');
            return;
        }

        // 1. Verifică și Incrementează Contorul
        const currentCount = getUseCount();
        if (currentCount >= MAX_USES) {
            updateStatus(); // Asigură că ProBox este vizibil
            return;
        }

        // 2. Procesare Imagine (Simulare Succes)
        processingOutput.innerHTML = `<p style="color: #008060;">Procesare imagine: ${file.name}... [Simulare succes]</p>`;
        
        // --- Contorizare de Succes ---
        incrementUseCount();
        updateStatus();
        // ------------------------------
    };

    // ----------------------------------------------------
    // Inițializare și Evenimente UI
    // ----------------------------------------------------
    
    // Click pe zona de drop deschide dialogul de fișiere
    dragDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Când un fișier este selectat
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            processFile(e.target.files[0]);
        }
    });

    // Implementarea Drag & Drop
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.style.backgroundColor = '#e6f7f2';
    });

    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.style.backgroundColor = '#fff';
    });

    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.style.backgroundColor = '#fff';
        if (e.dataTransfer.files.length) {
            processFile(e.dataTransfer.files[0]);
        }
    });
    
    // Inițializează statusul la încărcarea paginii
    updateStatus();
});