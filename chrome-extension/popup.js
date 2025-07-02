// Popup script para controlar la extensión
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const toggleStylesBtn = document.getElementById('toggleStyles');
    const resetStylesBtn = document.getElementById('resetStyles');
    const reloadPageBtn = document.getElementById('reloadPage');
    const applyColorsBtn = document.getElementById('applyColors');
    const applyCustomCSSBtn = document.getElementById('applyCustomCSS');
    const statusDiv = document.getElementById('status');
    const bgColorInput = document.getElementById('bgColor');
    const textColorInput = document.getElementById('textColor');
    const customCSSTextarea = document.getElementById('customCSS');

    // Función para actualizar el estado
    function updateStatus(message) {
        statusDiv.textContent = message;
        setTimeout(() => {
            statusDiv.textContent = 'Extensión lista para usar';
        }, 2000);
    }

    // Función para ejecutar scripts en la pestaña activa
    function executeInActiveTab(func, args = []) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('10.6.84.181')) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: func,
                    args: args
                });
            } else {
                updateStatus('Esta extensión solo funciona en 10.6.84.181');
            }
        });
    }

    // Activar/Desactivar estilos
    toggleStylesBtn.addEventListener('click', function() {
        executeInActiveTab(function() {
            const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
            const isDisabled = styleSheets[0] && styleSheets[0].disabled;
            
            styleSheets.forEach(sheet => {
                sheet.disabled = !isDisabled;
            });
            
            // También toggle los estilos de la extensión
            const extensionStyles = document.querySelector('style[data-extension="css-modifier"]');
            if (extensionStyles) {
                extensionStyles.disabled = !extensionStyles.disabled;
            }
        });
        updateStatus('Estilos alternados');
    });

    // Restablecer estilos
    resetStylesBtn.addEventListener('click', function() {
        executeInActiveTab(function() {
            // Remover estilos personalizados de la extensión
            const customStyles = document.querySelectorAll('style[data-extension="css-modifier"]');
            customStyles.forEach(style => style.remove());
            
            // Remover estilos dinámicos
            const dynamicStyles = document.getElementById('custom-extension-styles');
            if (dynamicStyles) {
                dynamicStyles.remove();
            }
            
            // Restaurar estilos originales
            const originalStyles = document.querySelectorAll('link[rel="stylesheet"]');
            originalStyles.forEach(sheet => {
                sheet.disabled = false;
            });
        });
        updateStatus('Estilos restablecidos');
    });

    // Recargar página
    reloadPageBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('10.6.84.181')) {
                chrome.tabs.reload(tabs[0].id);
                updateStatus('Página recargada');
                window.close();
            } else {
                updateStatus('Esta extensión solo funciona en 10.6.84.181');
            }
        });
    });

    // Aplicar colores personalizados
    applyColorsBtn.addEventListener('click', function() {
        const bgColor = bgColorInput.value;
        const textColor = textColorInput.value;
        
        executeInActiveTab(function(bgColor, textColor) {
            // Remover estilo previo si existe
            const existingStyle = document.querySelector('style[data-extension="css-modifier"]');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            // Crear nuevo estilo
            const style = document.createElement('style');
            style.setAttribute('data-extension', 'css-modifier');
            style.textContent = `
                body {
                    background-color: ${bgColor} !important;
                    color: ${textColor} !important;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    color: ${textColor} !important;
                }
                
                p, div, span {
                    color: ${textColor} !important;
                }
            `;
            document.head.appendChild(style);
        }, [bgColor, textColor]);
        
        updateStatus('Colores aplicados');
    });

    // Aplicar CSS personalizado
    applyCustomCSSBtn.addEventListener('click', function() {
        const customCSS = customCSSTextarea.value.trim();
        
        if (!customCSS) {
            updateStatus('Escribe CSS personalizado primero');
            return;
        }
        
        executeInActiveTab(function(css) {
            // Remover estilo previo si existe
            const existingStyle = document.querySelector('style[data-extension="css-modifier-custom"]');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            // Crear nuevo estilo
            const style = document.createElement('style');
            style.setAttribute('data-extension', 'css-modifier-custom');
            style.textContent = css;
            document.head.appendChild(style);
        }, [customCSS]);
        
        updateStatus('CSS personalizado aplicado');
    });

    // Cargar configuración guardada
    chrome.storage.sync.get(['bgColor', 'textColor', 'customCSS'], function(result) {
        if (result.bgColor) bgColorInput.value = result.bgColor;
        if (result.textColor) textColorInput.value = result.textColor;
        if (result.customCSS) customCSSTextarea.value = result.customCSS;
    });

    // Guardar configuración cuando cambien los valores
    bgColorInput.addEventListener('change', function() {
        chrome.storage.sync.set({bgColor: bgColorInput.value});
    });

    textColorInput.addEventListener('change', function() {
        chrome.storage.sync.set({textColor: textColorInput.value});
    });

    customCSSTextarea.addEventListener('input', function() {
        chrome.storage.sync.set({customCSS: customCSSTextarea.value});
    });

    // Verificar si estamos en la página correcta
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && !tabs[0].url.includes('10.6.84.181')) {
            updateStatus('Navega a http://10.6.84.181/ para usar la extensión');
        }
    });
});
