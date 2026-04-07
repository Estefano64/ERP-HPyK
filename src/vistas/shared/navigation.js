// ========== Global Date Formatting Utilities ==========
// Formato estándar: DD/MM/YYYY (día/mes/año)
// Disponible globalmente en todas las páginas

/**
 * Formatea una fecha a DD/MM/YYYY
 * @param {string|Date} value - fecha ISO, string o Date object
 * @param {string} fallback - valor si la fecha es nula (default: '-')
 * @returns {string} fecha formateada DD/MM/YYYY
 */
function formatDate(value, fallback = '-') {
    if (!value) return fallback;
    try {
        // Si es string YYYY-MM-DD (DATEONLY), parsear directamente sin timezone
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
            const [y, m, d] = value.trim().split('-');
            return `${d}/${m}/${y}`;
        }
        // Si es string ISO con T (datetime), extraer parte de fecha local
        const d = new Date(value);
        if (isNaN(d.getTime())) return fallback;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch { return fallback; }
}

/**
 * Formatea una fecha a DD/MM/YYYY HH:mm
 * @param {string|Date} value - fecha ISO, string o Date object
 * @param {string} fallback - valor si la fecha es nula (default: '-')
 * @returns {string} fecha formateada DD/MM/YYYY HH:mm
 */
function formatDateTime(value, fallback = '-') {
    if (!value) return fallback;
    try {
        const d = new Date(value);
        if (isNaN(d.getTime())) return fallback;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch { return fallback; }
}

/**
 * Formatea una fecha a DD/MM/YY (formato corto)
 */
function formatDateShort(value, fallback = '-') {
    if (!value) return fallback;
    try {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
            const [y, m, d] = value.trim().split('-');
            return `${d}/${m}/${y.slice(-2)}`;
        }
        const d = new Date(value);
        if (isNaN(d.getTime())) return fallback;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    } catch { return fallback; }
}

/**
 * Formatea una fecha a DD/MM/YY HH:mm (formato corto con hora)
 */
function formatDateTimeShort(value, fallback = '-') {
    if (!value) return fallback;
    try {
        const d = new Date(value);
        if (isNaN(d.getTime())) return fallback;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch { return fallback; }
}

// Exponer globalmente
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatDateShort = formatDateShort;
window.formatDateTimeShort = formatDateTimeShort;

// ========== Navigation Menu Loader and Manager ==========
class NavigationManager {
    constructor() {
        this.currentSection = this.detectCurrentSection();
        this.init();
    }

    // Detecta la sección actual basada en la URL
    detectCurrentSection() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/logistica/') || currentPath.includes('/catalogos/materiales')) {
            return 'logistica';
        } else if (currentPath.includes('/mantenimiento/')) {
            return 'mantenimiento';
        } else if (currentPath.includes('/produccion/')) {
            return 'produccion';
        } else if (currentPath.includes('/operativos/')) {
            return 'operativos';
        } else if (currentPath.includes('/catalogo/') || currentPath.includes('/catalogos/')) {
            return 'catalogos';
        }
        
        return null;
    }

    // Inicializa el menú de navegación
    async init() {
        await this.loadNavigationMenu();
        this.highlightCurrentSection();
        this.setupDropdownEvents();
    }

    // Carga el menú de navegación desde el archivo compartido
    async loadNavigationMenu() {
        try {
            const response = await fetch('/vistas/shared/nav-menu.html');
            const navHTML = await response.text();
            
            // Busca el contenedor del menú o lo crea
            let navContainer = document.getElementById('navigation-container');
            if (!navContainer) {
                // Si no existe, busca un nav existente o crea uno nuevo
                const existingNav = document.querySelector('nav');
                if (existingNav) {
                    existingNav.outerHTML = navHTML;
                } else {
                    // Crea el contenedor después del body
                    document.body.insertAdjacentHTML('afterbegin', navHTML);
                }
            } else {
                navContainer.innerHTML = navHTML;
            }
        } catch (error) {
            console.error('Error loading navigation menu:', error);
            // Fallback: mantener el menú existente si hay error
        }
    }

    // Resalta la sección actual
    highlightCurrentSection() {
        if (!this.currentSection) return;

        const sectionButton = document.querySelector(`[data-section="${this.currentSection}"]`);
        if (sectionButton) {
            // Remueve cualquier clase de highlight existente
            document.querySelectorAll('[data-section]').forEach(btn => {
                btn.classList.remove('bg-cyan-700', 'px-3', 'py-1', 'rounded');
            });
            
            // Agrega las clases de highlight a la sección actual
            sectionButton.classList.add('bg-cyan-700', 'px-3', 'py-1', 'rounded');
        }
    }

    // Configura los eventos de dropdown
    setupDropdownEvents() {
        // Función global para toggle dropdown
        window.toggleDropdown = (event, button) => {
            event.stopPropagation();
            
            // Cierra todos los otros dropdowns
            document.querySelectorAll('.dropdown div').forEach(div => {
                if (!div.classList.contains('hidden') && div !== button.nextElementSibling) {
                    div.classList.add('hidden');
                }
            });
            
            // Toggle del dropdown actual
            const dropdown = button.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        };

        // Cierra dropdown al hacer clic fuera
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown div').forEach(div => {
                    div.classList.add('hidden');
                });
            }
        });

        // Prevenir que el dropdown se cierre al hacer clic dentro de él
        document.querySelectorAll('.dropdown div').forEach(dropdown => {
            dropdown.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });
    }
}

// ========== Flatpickr: Forzar DD/MM/YYYY en todos los inputs de fecha ==========

function loadFlatpickr() {
    return new Promise((resolve) => {
        // Si ya está cargado, resolver inmediatamente
        if (window.flatpickr) { resolve(); return; }

        // Cargar CSS
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
        document.head.appendChild(css);

        // Cargar JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
        script.onload = () => {
            // Cargar idioma español
            const esScript = document.createElement('script');
            esScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/es.js';
            esScript.onload = resolve;
            document.head.appendChild(esScript);
        };
        document.head.appendChild(script);
    });
}

/**
 * Inicializa flatpickr en todos los input[type="date"] y input[type="datetime-local"]
 * - Muestra DD/MM/YYYY al usuario (altFormat)
 * - Mantiene YYYY-MM-DD internamente (dateFormat) para el servidor
 */
function initDatePickers() {
    // Inputs tipo date → DD/MM/YYYY con calendario
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (input._flatpickr) return; // Ya inicializado
        const currentValue = input.value;
        input.type = 'text';
        flatpickr(input, {
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd/m/Y',
            locale: 'es',
            allowInput: true,
            defaultDate: currentValue || null,
            onReady: function(selectedDates, dateStr, instance) {
                instance.altInput.placeholder = 'DD/MM/AAAA';
            }
        });
    });

    // Inputs tipo datetime-local → DD/MM/YYYY HH:mm con calendario+hora
    document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
        if (input._flatpickr) return;
        const currentValue = input.value;
        input.type = 'text';
        flatpickr(input, {
            dateFormat: 'Y-m-d\\TH:i',
            altInput: true,
            altFormat: 'd/m/Y H:i',
            enableTime: true,
            time_24hr: true,
            locale: 'es',
            allowInput: true,
            defaultDate: currentValue || null,
            onReady: function(selectedDates, dateStr, instance) {
                instance.altInput.placeholder = 'DD/MM/AAAA HH:mm';
            }
        });
    });
}

// Exponer para poder re-inicializar después de agregar inputs dinámicos
window.initDatePickers = initDatePickers;

// Inicializa el navegador y datepickers cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    new NavigationManager();
    await loadFlatpickr();
    initDatePickers();

    // Observer: detectar nuevos inputs de fecha agregados dinámicamente
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if ((node.tagName === 'INPUT' && (node.type === 'date' || node.type === 'datetime-local')) ||
                    node.querySelector?.('input[type="date"], input[type="datetime-local"]')) {
                    initDatePickers();
                    return;
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

// También expone la función para compatibilidad con código existente
window.NavigationManager = NavigationManager;