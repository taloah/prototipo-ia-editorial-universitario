/**
 * Módulo de construcción de prompts para Comunicación Editorial Universitaria
 *
 * Especializado en borradores de: comunicados, noticias, blogs institucionales, resúmenes de eventos y anuncios para la comunidad universitaria.
 */

/**
* Construye un prompt estructurado para generación de contenido de comunicación universitaria

* @param {Object} params - Parámetros de entrada del usuario
* @returns {string} Prompt estructurado listo para enviar al modelo de IA
* @throws {Error} Si los parámetros requeridos no están presentes
*/

export const buildEditorialPrompt = (params) => {

    // 1. Validación y extracción de parámetros

    const {
        tipoContenido,
        publicoObjetivo,
        tono,
        temaPrincipal,
        puntosClave = [],        // Información específica a incluir
        longitudAproximada = "mediano (400-600 palabras)",
        elementosExcluir = []    // Elementos de estilo a evitar
    } = params;

    // El tema es requerido
    if (!temaPrincipal || temaPrincipal.trim() === '') {
        throw new Error('El tema principal es requerido para generar el contenido');
    }

    // 2. Construcción del prompt por secciones

    //  A: ROL Y CONTEXTO INSTITUCIONAL

    let prompt = `Eres un redactor especializado en comunicación institucional universitaria con más de 8 años de experiencia en el departamento de comunicaciones de una universidad prestigiosa. Tu expertise está en crear contenido claro, efectivo y apropiado para diferentes audiencias dentro del ecosistema universitario.\n\n`;

    //  B: TAREA ESPECÍFICA

    prompt += `TAREA PRINCIPAL:
Redacta un BORRADOR listo para revisión editorial sobre:\n`;
    prompt += `"${temaPrincipal}"\n\n`;

    //  C: ESPECIFICACIONES DEL ENCARGO

    prompt += `ESPECIFICACIONES DEL BORRADOR:\n`;
    prompt += `Tipo de contenido: ${tipoContenido}\n`;
    prompt += `Destinatarios principales: ${publicoObjetivo}\n`;
    prompt += `Tono requerido: ${tono}. `;

    // Personalización basada en el tono

    if (tono === 'Formal institucional') {
        prompt += `Mantenga un lenguaje profesional y respetuoso, apropiado para comunicaciones oficiales.\n`;
    } else if (tono === 'Informativo claro') {
        prompt += `Priorice la claridad y precisión. Sea directo y evite ambigüedades.\n`;
    } else if (tono === 'Motivacional') {
        prompt += `Incluya elementos inspiradores, reconozca logros y fomente participación.\n`;
    } else if (tono === 'Urgente/Importante') {
        prompt += `Sea conciso, destaque la información crítica y use estructura que facilite comprensión rápida.\n`;
    }

    prompt += `Extensión: ${longitudAproximada}\n`;

    //  D: INFORMACIÓN ESPECÍFICA A INCLUIR
    if (puntosClave.length > 0) {
        prompt += `Información específica que DEBE incluirse:\n`;
        puntosClave.forEach((punto, index) => {
            prompt += `  ${index + 1}. ${punto}\n`;
        });
    }

    // SECCIÓN E: ELEMENTOS A EVITAR
    if (elementosExcluir.length > 0) {
        prompt += `• **Elementos de estilo a EVITAR:**\n`;
        elementosExcluir.forEach(elemento => {
            prompt += `  - ${elemento}\n`;
        });
    }

    // 3. ESTRUCTURA ESPECÍFICA SEGÚN TIPO DE CONTENIDO

    prompt += `\nESTRUCTURA REQUERIDA (adaptada al tipo de contenido):\n`;

    // Estructuras diferenciadas por tipo de contenido
    if (tipoContenido === 'Comunicado interno') {
        prompt += `1. ENCABEZADO OFICIAL: (Logo institucional, fecha, referencia)\n`;
        prompt += `2. ASUNTO/TÍTULO: Claro y descriptivo\n`;
        prompt += `3. SALUDO INSTITUCIONAL: Apropiado para los destinatarios\n`;
        prompt += `4. CUERPO PRINCIPAL:\n`;
        prompt += `Contexto breve\n`;
        prompt += `Información central (qué, cuándo, dónde, por qué)\n`;
        prompt += `Impacto en la comunidad universitaria\n`;
        prompt += `Instrucciones o pasos a seguir (si aplica)\n`;
        prompt += `5. INFORMACIÓN PRÁCTICA: Fechas, plazos, contactos, enlaces\n`;
        prompt += `6. CIERRE FORMAL:\n`;
        prompt += `7. FIRMA/RESPONSABLE: Departamento o autoridad correspondiente\n`;
    }
    else if (tipoContenido === 'Noticia institucional') {
        prompt += `1. TITULAR PERIODÍSTICO: Atractivo y preciso\n`;
        prompt += `2. ENTRADILLA/LEAD: Resumen esencial (1-2 párrafos máximo)\n`;
        prompt += `3. CUERPO DE LA NOTICIA:\n`;
        prompt += `Desarrollo en orden decreciente de importancia\n`;
        prompt += `Citas relevantes (si las hay)\n`;
        prompt += `Contexto institucional\n`;
        prompt += `Datos verificables\n`;
        prompt += `4. INFORMACIÓN ADICIONAL:\n`;
        prompt += `Antecedentes breves\n`;
        prompt += `Próximos pasos o implicaciones\n`;
        prompt += `5. DATOS DE CONTACTO: Para más información\n`;
    }
    else if (tipoContenido === 'Entrada de blog') {
        prompt += `1. TÍTULO ATRACTIVO: Que genere interés\n`;
        prompt += `2. INTRODUCCIÓN: Conectar con la experiencia universitaria\n`;
        prompt += `3. DESARROLLO:\n`;
        prompt += `Organizado en secciones con subtítulos\n`;
        prompt += `Lenguaje cercano pero profesional\n`;
        prompt += `Ejemplos o casos relevantes\n`;
        prompt += `Reflexiones o análisis\n`;
        prompt += `4. CONCLUSIÓN: Síntesis y llamado a la reflexión/acción\n`;
        prompt += `5. PREGUNTA AL LECTOR: Para fomentar interacción\n`;
    }
    else if (tipoContenido === 'Resumen de evento') {
        prompt += `1. TÍTULO DESCRIPTIVO: Incluir nombre del evento y fecha\n`;
        prompt += `2. INFORMACIÓN BÁSICA: Qué, cuándo, dónde, quiénes\n`;
        prompt += `3. DESARROLLO:\n`;
        prompt += `Puntos destacados del evento\n`;
        prompt += `Participantes o ponentes relevantes\n`;
        prompt += `Conclusiones principales\n`;
        prompt += `Momentos significativos\n`;
        prompt += `4. IMPACTO O LOGROS: Resultados o aprendizajes\n`;
        prompt += `5. PRÓXIMOS EVENTOS O SEGUIMIENTO:\n`;
        prompt += `6. GALERÍA DE FOTOS/ENLACES: (mencionar disponibilidad)\n`;
    }
    else if (tipoContenido === 'Anuncio') {
        prompt += `1. TITULAR DIRECTO: Anunciando claramente\n`;
        prompt += `2. INFORMACIÓN ESENCIAL: De manera inmediatamente visible\n`;
        prompt += `3. DETALLES COMPLETOS:\n`;
        prompt += `Requisitos o condiciones\n`;
        prompt += `Beneficios o características\n`;
        prompt += `Proceso a seguir\n`;
        prompt += `4. PLAZOS Y FECHAS: Con claridad\n`;
        prompt += `5. LLAMADO A LA ACCIÓN: Instrucciones específicas\n`;
        prompt += `6. CONTACTOS Y ENLACES: Para más información\n`;
    }

    // 4. INSTRUCCIONES FINALES DE CALIDAD
    prompt += `\nINSTRUCCIONES DE CALIDAD EDITORIAL:\n`;
    prompt += `El borrador debe requerir solo ajustes menores de edición humana\n`;
    prompt += `Adapte el lenguaje al nivel de formalidad requerido por la audiencia\n`;
    prompt += `Use lenguaje inclusivo y accesible\n`;
    prompt += `Evite la jerga burocrática innecesaria\n`;
    prompt += `Mantenga coherencia con la identidad institucional universitaria\n`;
    prompt += `Priorice la claridad sobre la complejidad\n`;
    prompt += `NO incluya placeholders como [datos por completar] o [fotos por añadir]\n`;
    prompt += `Si necesita referirse a datos específicos no proporcionados, hágalo de forma genérica pero creíble\n\n`;

    prompt += `Por favor, genere el BORRADOR COMPLETO siguiendo estrictamente todas las especificaciones anteriores.`;

    return prompt;
};

/**
 * Genera parámetros de ejemplo para pruebas - COMUNICACIÓN UNIVERSITARIA
 * @returns {Object} Objeto con parámetros de ejemplo realistas
 */
export const getExampleParams = () => {
    return {
        tipoContenido: "Comunicado interno",
        publicoObjetivo: "Toda la comunidad universitaria (estudiantes, docentes, administrativos)",
        tono: "Informativo claro",
        temaPrincipal: "Suspensión temporal de actividades por mantenimiento del sistema eléctrico",
        puntosClave: [
            "Fechas afectadas: 15 y 16 de noviembre",
            "Horario: 8:00 AM a 6:00 PM ambos días",
            "Áreas afectadas: Edificios A, B y C del campus central",
            "Servicios que seguirán operando: Biblioteca digital, plataforma virtual",
            "Contacto para emergencias: extensión 1234",
            "Reanudación normal: 17 de noviembre a las 8:00 AM"
        ],
        longitudAproximada: "corto (200-300 palabras)",
        elementosExcluir: [
            "Lenguaje burocrático complejo",
            "Tecnicismos eléctricos innecesarios",
            "Formalidad excesiva que dificulte comprensión"
        ]
    };
};

/**
 * Obtiene las opciones disponibles para cada parámetro
 * @returns {Object} Opciones para los selects del formulario
 */
export const getAvailableOptions = () => {
    return {
        tiposContenido: [
            'Comunicado interno',
            'Noticia institucional',
            'Entrada de blog',
            'Resumen de evento',
            'Anuncio'
        ],
        publicosObjetivo: [
            'Estudiantes',
            'Docentes',
            'Personal administrativo',
            'Egresados',
            'Toda la comunidad universitaria'
        ],
        tonos: [
            'Formal institucional',
            'Informativo claro',
            'Motivacional',
            'Urgente/Importante'
        ],
        longitudes: [
            'corto (200-300 palabras)',
            'mediano (400-600 palabras)',
            'largo (700-1000 palabras)'
        ]
    };

};