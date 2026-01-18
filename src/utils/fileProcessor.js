/**
 * Utilidades para procesar archivos de texto en el frontend
 * Soporta: .txt, .md, .csv (solo texto)
 */

/**
 * Valida si un archivo es de tipo texto soportado
 * @param {File} file - Objeto File del input
 * @returns {Object} { isValid: boolean, error?: string }
 */
export const validateTextFile = (file) => {
    if (!file) {
        return { isValid: false, error: 'No se seleccionó archivo' };
    }

    // Validar tipo por extensión (más confiable que file.type)
    const allowedExtensions = ['.txt', '.md', '.csv', '.json'];
    const fileName = file.name.toLowerCase();

    const hasValidExtension = allowedExtensions.some(ext =>
        fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
        return {
            isValid: false,
            error: `Formato no soportado. Use: ${allowedExtensions.join(', ')}`
        };
    }

    // Validar tamaño
    const maxSize = 50 * 1024; // 50KB
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `Archivo muy grande (${(file.size / 1024).toFixed(1)}KB). Máx: 50KB`
        };
    }

    return { isValid: true };
};

/**
 * Extrae texto de un archivo usando FileReader
 * @param {File} file - Objeto File
 * @returns {Promise<string>} - Texto extraído
 */
export const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                let text = event.target.result;

                // Limpieza básica
                text = cleanExtractedText(text);

                // Verificar que realmente sea texto legible
                if (!isReadableText(text)) {
                    reject(new Error('El archivo no contiene texto legible'));
                    return;
                }

                resolve(text);
            } catch (error) {
                reject(new Error('Error procesando el archivo: ' + error.message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error leyendo el archivo'));
        };

        // Leer como texto UTF-8
        reader.readAsText(file, 'UTF-8');
    });
};

/**
 * Limpia y formatea texto extraído
 * @param {string} text - Texto crudo
 * @returns {string} - Texto limpiado
 */
const cleanExtractedText = (text) => {
    if (!text) return '';

    // Reemplazar múltiples espacios/lineas
    let cleaned = text
        .replace(/\r\n/g, '\n')  // Normalizar line breaks
        .replace(/\s+/g, ' ')    // Múltiples espacios a uno
        .replace(/\n\s*\n/g, '\n\n')  // Múltiples líneas vacías a dos
        .trim();

    // Limitar longitud para no exceder contexto del modelo
    const MAX_CHARS = 5000; // ~1250 tokens
    if (cleaned.length > MAX_CHARS) {
        cleaned = cleaned.substring(0, MAX_CHARS) + '\n\n...[texto truncado]';
    }

    return cleaned;
};

/**
 * Verifica si el texto es legible (no binario/corrupto)
 * @param {string} text - Texto a verificar
 * @returns {boolean}
 */
const isReadableText = (text) => {
    if (!text || text.length < 10) return false;

    // Verificar proporción de caracteres imprimibles
    const printableChars = text.replace(/[^\x20-\x7E\n\r\t]/g, '');
    const printableRatio = printableChars.length / text.length;

    // Al menos 80% deben ser caracteres imprimibles
    return printableRatio > 0.8;
};

/**
 * Analiza el texto extraído para metadata útil
 * @param {string} text - Texto extraído
 * @returns {Object} Metadata
 */
export const analyzeExtractedText = (text) => {
    if (!text) return {};

    return {
        length: text.length,
        words: text.split(/\s+/).filter(w => w.length > 0).length,
        lines: text.split('\n').length,
        preview: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
        isTruncated: text.includes('...[texto truncado]')
    };
};