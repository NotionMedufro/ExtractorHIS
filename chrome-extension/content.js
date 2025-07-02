// Content script para modificaciones adicionales con JavaScript
console.log('Extensión CSS Modifier cargada para:', window.location.href);

// Función para agregar modificaciones dinámicas
function applyDynamicChanges() {
    // Ejemplo: Agregar un botón flotante
    const floatingButton = document.createElement('div');
    floatingButton.innerHTML = '🎨';
    floatingButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #3498db;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    floatingButton.addEventListener('click', () => {
        toggleCustomStyles();
    });
    
    floatingButton.addEventListener('mouseenter', () => {
        floatingButton.style.transform = 'scale(1.1)';
    });
    
    floatingButton.addEventListener('mouseleave', () => {
        floatingButton.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(floatingButton);
}

// Función para activar/desactivar estilos personalizados
function toggleCustomStyles() {
    const existingStyle = document.getElementById('custom-extension-styles');
    
    if (existingStyle) {
        existingStyle.remove();
        console.log('Estilos personalizados desactivados');
    } else {
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-extension-styles';
        styleElement.textContent = `
            /* Estilos adicionales que se pueden activar/desactivar */
            * {
                transition: all 0.3s ease !important;
            }
            
            img {
                border-radius: 8px !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            }
            
            input[type="text"], input[type="email"], input[type="password"], textarea {
                border: 2px solid #3498db !important;
                border-radius: 4px !important;
                padding: 8px !important;
                outline: none !important;
            }
            
            input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, textarea:focus {
                border-color: #e74c3c !important;
                box-shadow: 0 0 5px rgba(231, 76, 60, 0.3) !important;
            }
        `;
        document.head.appendChild(styleElement);
        console.log('Estilos personalizados activados');
    }
}

// Función para observar cambios dinámicos en la página
function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Aplicar estilos a nuevos elementos que se agreguen dinámicamente
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Aquí puedes agregar lógica para elementos específicos
                        console.log('Nuevo elemento detectado:', node.tagName);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Aplicar cambios cuando la página esté completamente cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        applyDynamicChanges();
        observePageChanges();
    });
} else {
    applyDynamicChanges();
    observePageChanges();
}

// Mensaje de confirmación
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Extensión CSS Modifier activa en:', window.location.href);
});
