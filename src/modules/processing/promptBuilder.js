/**
 * Módulo de construcción de prompts para contenido editorial universitario
 * 
 * Este módulo toma parámetros del usuario y construye un prompt estructurado
 * para modelos de lenguaje, optimizado para la generación de contenido editorial.
 */

/**
 * Construye un prompt estructurado para generación de contenido editorial universitario
 * @param {Object} params - Parámetros de entrada del usuario
 * @returns {string} Prompt estructurado listo para enviar al modelo de IA
 * @throws {Error} Si los parámetros requeridos no están presentes
 */

export const buildEditorialPrompt = (params) => {

    const {
        tipoContenido,
        publicoObjetivo,
        tono,
        temaPrincipal,
        puntosClave = [],
        longitudAproximada = '500 palabras',
        referenciasEstilo = 'Ninguno',
        excluir = [],
    } = params;


    if (!temaPrincipal || temaPrincipal.trim() === '') {
        throw new Error('El parámetro "temaPrincipal" es obligatorio y no puede estar vacío para generar el contenido.');
    }

    // Sección 1: Contexto del sistema
    let prompt = `Eres un escritor y editor experto en contenidos universitarios con más de 10 años de experiencia. 
Trabajas para el departamento de comunicaciones de una prestigiosa universidad y tu especialidad es adaptar 
contenido académico complejo para diferentes audiencias manteniendo el rigor intelectual.\n\n`;

    // Sección 2: Tarea específica
    prompt += `**TAREA PRINCIPAL:** 
Genera un borrador editorial listo para revisión humana sobre el siguiente tema:\n`;
    prompt += `"${temaPrincipal}"\n\n`;


    // Sección 3: Especificaciones técnicas
    prompt += `**ESPECIFICACIONES DEL ENCARGO:**\n`;
    prompt += `• **Tipo de contenido:** ${tipoContenido}\n`;
    prompt += `• **Público objetivo:** ${publicoObjetivo}\n`;
    prompt += `• **Tono y estilo:** ${tono}. `;

    // Condicional basado en el tono
    if (tono === 'Formal') {
        prompt += `Utilice lenguaje académico preciso, evite contracciones y mantenga una voz objetiva.\n`;
    } else if (tono === 'Divulgativo') {
        prompt += `Simplifique conceptos complejos, use analogías y mantenga un balance entre rigor y accesibilidad.\n`;
    } else if (tono === 'Inspirador') {
        prompt += `Incluya narrativas motivacionales, casos de éxito y un llamado a la acción positivo.\n`;
    }

    prompt += `• **Longitud aproximada:** ${longitudAproximada}\n`;

    // Manejo del array puntosClave
    if (puntosClave.length > 0) {
        prompt += `• **Puntos clave a desarrollar:**\n`;
        puntosClave.forEach((punto, index) => {
            prompt += `  ${index + 1}. ${punto}\n`;
        });
    }

    // Elementos a excluir
    if (excluir.length > 0) {
        prompt += `• **Elementos a excluir o evitar:**\n`;
        excluir.forEach(elemento => {
            prompt += `  - ${elemento}\n`;
        });
    }

    // Referencias de estilo
    prompt += `• **Guía de estilo referencial:** ${referenciasEstilo}. `;
    if (referenciasEstilo !== "Ninguno") {
        prompt += `Siga las convenciones de citación y formato correspondientes cuando sea apropiado.\n\n`;
    } else {
        prompt += `\n\n`;
    }

    // Sección 4: Estructura requerida
    prompt += `**ESTRUCTURA DEL BORRADOR:**\n`;
    prompt += `1. **TÍTULO PROVISIONAL:** (Crea 2-3 opciones atractivas y apropiadas para el público objetivo)\n`;
    prompt += `2. **INTRODUCCIÓN:** (Máximo 15% del contenido. Contextualice el tema, establezca su relevancia para el contexto universitario y presente una tesis clara)\n`;
    prompt += `3. **DESARROLLO:** (70-80% del contenido. Organice en 3-4 secciones con subtítulos informativos. Incluya:\n`;
    prompt += `   • Argumentación lógica\n`;
    prompt += `   • Evidencia o ejemplos contextualizados\n`;
    prompt += `   • Conexiones con la experiencia universitaria\n`;
    prompt += `   • Transiciones fluidas entre ideas)\n`;
    prompt += `4. **CONCLUSIÓN:** (10-15% del contenido. Sintetice los puntos principales, ofrezca reflexiones finales y, si aplica, sugiera implicaciones futuras o llamados a la acción)\n`;
    prompt += `5. **METADATOS:**\n`;
    prompt += `   • Palabras clave: 5-7 términos relevantes para búsqueda\n`;
    prompt += `   • Resumen ejecutivo: 2-3 oraciones que capturen la esencia\n\n`;


    // Sección 5: Instrucciones finales
    prompt += `**INSTRUCCIONES FINALES:**\n`;
    prompt += `- Priorice la claridad sobre la complejidad innecesaria.\n`;
    prompt += `- Mantenga coherencia con la identidad institucional universitaria.\n`;
    prompt += `- Evite sesgos y asegure inclusividad en el lenguaje.\n`;
    prompt += `- El borrador debe requerir solo ajustes menores de edición humana.\n`;
    prompt += `- **IMPORTANTE:** No incluya placeholders como [aquí datos] o [cita necesaria]. Si necesita referirse a datos, hágalo de forma genérica pero creíble.\n\n`;

    prompt += `Por favor, genere el borrador completo siguiendo estrictamente todas las especificaciones anteriores.`;

    return prompt;
};

/**
 * Genera parámetros de ejemplo para pruebas
 * @returns {Object} Objeto con parámetros de ejemplo
 */
export const getExampleParams = () => {
    return {
        tipoContenido: "Artículo de investigación divulgativo",
        publicoObjetivo: "Estudiantes de primer año",
        tono: "Divulgativo",
        temaPrincipal: "El impacto de la inteligencia artificial en los métodos de aprendizaje universitario",
        puntosClave: [
            "Aprendizaje personalizado mediante plataformas adaptativas",
            "Herramientas de asistencia como tutores IA y correctores automáticos",
            "Desafíos éticos y de desarrollo de pensamiento crítico",
            "Preparación para un mercado laboral transformado por la IA"
        ],
        longitudAproximada: "800 palabras",
        referenciasEstilo: "APA 7",
        excluir: ["Lenguaje excesivamente técnico", "Tono alarmista o utópico", "Ejemplos no relacionados con educación superior"]
    };
};