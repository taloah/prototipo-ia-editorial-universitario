// /**
//  * Módulo de construcción de prompts para Comunicación Editorial Universitaria
//  *
//  * Especializado en borradores de: comunicados, noticias, blogs institucionales, resúmenes de eventos y anuncios para la comunidad universitaria.
//  */

// /**
// * Construye un prompt estructurado para generación de contenido de comunicación universitaria

// * @param {Object} params - Parámetros de entrada del usuario
// * @returns {string} Prompt estructurado listo para enviar al modelo de IA
// * @throws {Error} Si los parámetros requeridos no están presentes
// */

// export const buildEditorialPrompt = (params, contextoArchivo = '') => {

//     // 1. Validación y extracción de parámetros

//     const {
//         tipoContenido,
//         publicoObjetivo,
//         tono,
//         temaPrincipal,
//         puntosClave = [],        // Información específica a incluir
//         longitudAproximada = "mediano (400-600 palabras)",
//         elementosExcluir = []    // Elementos de estilo a evitar
//     } = params;

//     // Obtener fecha actual en formato legible
//     const fechaActual = new Date().toLocaleDateString('es-ES', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     // El tema es requerido
//     if (!temaPrincipal || temaPrincipal.trim() === '') {
//         throw new Error('El tema principal es requerido para generar el contenido');
//     }

//     // 2. Construcción del prompt por secciones

//     //  A: ROL Y CONTEXTO INSTITUCIONAL

//     let prompt = `Eres un redactor especializado en comunicación institucional universitaria con más de 8 años de experiencia en el departamento de comunicaciones de la Universidad Católica Santiago de Guayaquil (UCSG). Tu expertise está en crear contenido claro, efectivo y apropiado para diferentes audiencias dentro del ecosistema universitario.\n\n`;

//     // CONTEXTO TEMPORAL Y RESTRICCIONES DE IDENTIDAD
//     prompt += `CONTEXTO INSTITUCIONAL OBLIGATORIO:
//     - Institución: Universidad Católica Santiago de Guayaquil (UCSG)
//     - Año de referencia para fechas: ${fechaActual} (SIEMPRE usa el año actual a menos que se especifique otra cosa)
//     - Ciudad: Guayaquil, Ecuador
//     - Información de contacto genérica apropiada (cuando sea necesario):
//     * Teléfono: +593 4-XXX-XXXX
//     * Correo: comunicacion@cu.ucsg.edu.ec
//     * Sitio web: www.ucsg.edu.ec
//     * Dirección: Av. Carlos Julio Arosemena Tola Km. 1.5 Vía a Daule
//     - Usa términos institucionales correctos: "UCSG", "nuestra universidad"\n\n`;
//     prompt += `RESTRICCIÓN DE NOMBRES: NO inventes ni uses nombres propios de personas (Decanos, Directores, Coordinadores). Usa siempre los cargos institucionales (ej. "El Decanato", "La Dirección de Carrera", "El Rectorado").\n`;

//     //  B: TAREA ESPECÍFICA

//     prompt += `TAREA PRINCIPAL:
// Redacta un BORRADOR listo para revisión editorial sobre:\n`;
//     prompt += `"${temaPrincipal}"\n\n`;

//     //  C: ESPECIFICACIONES DEL ENCARGO

//     prompt += `ESPECIFICACIONES DEL BORRADOR:\n`;
//     prompt += `Tipo de contenido: ${tipoContenido}\n`;
//     prompt += `Destinatarios principales: ${publicoObjetivo}\n`;
//     prompt += `Tono requerido: ${tono}. `;

//     // Personalización basada en el tono

//     if (tono === 'Formal institucional') {
//         prompt += `Mantenga un lenguaje profesional y respetuoso, apropiado para comunicaciones oficiales.\n`;
//     } else if (tono === 'Informativo claro') {
//         prompt += `Priorice la claridad y precisión. Sea directo y evite ambigüedades.\n`;
//     } else if (tono === 'Motivacional') {
//         prompt += `Incluya elementos inspiradores, reconozca logros y fomente participación.\n`;
//     } else if (tono === 'Urgente/Importante') {
//         prompt += `Sea conciso, destaque la información crítica y use estructura que facilite comprensión rápida.\n`;
//     }

//     prompt += `Extensión: ${longitudAproximada}\n`;

//     //  D: INFORMACIÓN ESPECÍFICA A INCLUIR
//     if (puntosClave.length > 0) {
//         prompt += `Información específica que DEBE incluirse:\n`;
//         puntosClave.forEach((punto, index) => {
//             prompt += `  ${index + 1}. ${punto}\n`;
//         });
//     }

//     // SECCIÓN E: ELEMENTOS A EVITAR
//     if (elementosExcluir.length > 0) {
//         prompt += `• **Elementos de estilo a EVITAR:**\n`;
//         elementosExcluir.forEach(elemento => {
//             prompt += `  - ${elemento}\n`;
//         });
//     }

//     // 3. ESTRUCTURA ESPECÍFICA SEGÚN TIPO DE CONTENIDO

//     prompt += `\nESTRUCTURA REQUERIDA (adaptada al tipo de contenido):\n`;

//     // Estructuras diferenciadas por tipo de contenido
//     if (tipoContenido === 'Comunicado interno') {
//         prompt += `1. ENCABEZADO OFICIAL: (Logo institucional, fecha, referencia)\n`;
//         prompt += `2. ASUNTO/TÍTULO: Claro y descriptivo\n`;
//         prompt += `3. SALUDO INSTITUCIONAL: Apropiado para los destinatarios\n`;
//         prompt += `4. CUERPO PRINCIPAL:\n`;
//         prompt += `Contexto breve\n`;
//         prompt += `Información central (qué, cuándo, dónde, por qué)\n`;
//         prompt += `Impacto en la comunidad universitaria\n`;
//         prompt += `Instrucciones o pasos a seguir (si aplica)\n`;
//         prompt += `5. INFORMACIÓN PRÁCTICA: Fechas, plazos, contactos, enlaces\n`;
//         prompt += `6. CIERRE FORMAL:\n`;
//         prompt += `7. FIRMA/RESPONSABLE: Departamento o autoridad correspondiente\n`;
//     }
//     else if (tipoContenido === 'Noticia institucional') {
//         prompt += `1. TITULAR PERIODÍSTICO: Atractivo y preciso\n`;
//         prompt += `2. ENTRADILLA/LEAD: Resumen esencial (1-2 párrafos máximo)\n`;
//         prompt += `3. CUERPO DE LA NOTICIA:\n`;
//         prompt += `Desarrollo en orden decreciente de importancia\n`;
//         prompt += `Citas relevantes (si las hay)\n`;
//         prompt += `Contexto institucional\n`;
//         prompt += `Datos verificables\n`;
//         prompt += `4. INFORMACIÓN ADICIONAL:\n`;
//         prompt += `Antecedentes breves\n`;
//         prompt += `Próximos pasos o implicaciones\n`;
//         prompt += `5. DATOS DE CONTACTO: Para más información\n`;
//     }
//     else if (tipoContenido === 'Entrada de blog') {
//         prompt += `1. TÍTULO ATRACTIVO: Que genere interés\n`;
//         prompt += `2. INTRODUCCIÓN: Conectar con la experiencia universitaria\n`;
//         prompt += `3. DESARROLLO:\n`;
//         prompt += `Organizado en secciones con subtítulos\n`;
//         prompt += `Lenguaje cercano pero profesional\n`;
//         prompt += `Ejemplos o casos relevantes\n`;
//         prompt += `Reflexiones o análisis\n`;
//         prompt += `4. CONCLUSIÓN: Síntesis y llamado a la reflexión/acción\n`;
//         prompt += `5. PREGUNTA AL LECTOR: Para fomentar interacción\n`;
//     }
//     else if (tipoContenido === 'Resumen de evento') {
//         prompt += `1. TÍTULO DESCRIPTIVO: Incluir nombre del evento y fecha\n`;
//         prompt += `2. INFORMACIÓN BÁSICA: Qué, cuándo, dónde, quiénes\n`;
//         prompt += `3. DESARROLLO:\n`;
//         prompt += `Puntos destacados del evento\n`;
//         prompt += `Participantes o ponentes relevantes\n`;
//         prompt += `Conclusiones principales\n`;
//         prompt += `Momentos significativos\n`;
//         prompt += `4. IMPACTO O LOGROS: Resultados o aprendizajes\n`;
//         prompt += `5. PRÓXIMOS EVENTOS O SEGUIMIENTO:\n`;
//         prompt += `6. GALERÍA DE FOTOS/ENLACES: (mencionar disponibilidad)\n`;
//     }
//     else if (tipoContenido === 'Anuncio') {
//         prompt += `1. TITULAR DIRECTO: Anunciando claramente\n`;
//         prompt += `2. INFORMACIÓN ESENCIAL: De manera inmediatamente visible\n`;
//         prompt += `3. DETALLES COMPLETOS:\n`;
//         prompt += `Requisitos o condiciones\n`;
//         prompt += `Beneficios o características\n`;
//         prompt += `Proceso a seguir\n`;
//         prompt += `4. PLAZOS Y FECHAS: Con claridad\n`;
//         prompt += `5. LLAMADO A LA ACCIÓN: Instrucciones específicas\n`;
//         prompt += `6. CONTACTOS Y ENLACES: Para más información\n`;
//     }

//     // 4. INSTRUCCIONES FINALES DE CALIDAD
//     prompt += `\nINSTRUCCIONES DE CALIDAD EDITORIAL:\n`;
//     prompt += `El borrador debe requerir solo ajustes menores de edición humana\n`;
//     prompt += `Adapte el lenguaje al nivel de formalidad requerido por la audiencia\n`;
//     prompt += `Use lenguaje inclusivo y accesible\n`;
//     prompt += `Evite la jerga burocrática innecesaria\n`;
//     prompt += `Mantenga coherencia con la identidad institucional universitaria\n`;
//     prompt += `Priorice la claridad sobre la complejidad\n`;
//     prompt += `NO incluya placeholders como [datos por completar] o [fotos por añadir]\n`;
//     prompt += `Si necesita referirse a datos específicos no proporcionados, hágalo de forma genérica pero creíble\n\n`;

//     // 5. INTEGRACIÓN DE CONTEXTO ADICIONAL DE ARCHIVO (SI APLICA)

//     if (contextoArchivo && contextoArchivo.trim()) {
//         prompt += `\n\n--- CONTEXTO ADICIONAL DEL DOCUMENTO ADJUNTO ---\n`;
//         prompt += `A continuación se proporciona texto extraído de un documento adjunto:\n\n`;
//         prompt += `"${contextoArchivo}"\n\n`;
//         prompt += `--- FIN DEL CONTEXTO ADJUNTO ---\n\n`;

//         prompt += `**INSTRUCCIONES PARA USAR EL CONTEXTO:**\n`;
//         prompt += `1. Use este texto SOLO como información de referencia o contexto adicional\n`;
//         prompt += `2. Integre datos, cifras o información relevante SI es pertinente al tema principal\n`;
//         prompt += `3. NO repita el texto adjunto palabra por palabra\n`;
//         prompt += `4. SI el texto adjunto NO es relevante para "${temaPrincipal}", ignórelo\n`;
//         prompt += `5. Priorice SIEMPRE los parámetros principales proporcionados arriba\n\n`;
//     }

//     prompt += `Por favor, genere el BORRADOR COMPLETO siguiendo estrictamente todas las especificaciones anteriores.`;

//     return prompt;
// };

// /**
//  * Genera parámetros de ejemplo para pruebas - COMUNICACIÓN UNIVERSITARIA
//  * @returns {Object} Objeto con parámetros de ejemplo realistas
//  */
// export const getExampleParams = () => {
//     return {
//         tipoContenido: "Comunicado interno",
//         publicoObjetivo: "Toda la comunidad universitaria (estudiantes, docentes, administrativos)",
//         tono: "Informativo claro",
//         temaPrincipal: "Suspensión temporal de actividades por mantenimiento del sistema eléctrico",
//         puntosClave: [
//             "Fechas afectadas: 15 y 16 de noviembre",
//             "Horario: 8:00 AM a 6:00 PM ambos días",
//             "Áreas afectadas: Edificios A, B y C del campus central",
//             "Servicios que seguirán operando: Biblioteca digital, plataforma virtual",
//             "Contacto para emergencias: extensión 1234",
//             "Reanudación normal: 17 de noviembre a las 8:00 AM"
//         ],
//         longitudAproximada: "corto (200-300 palabras)",
//         elementosExcluir: [
//             "Lenguaje burocrático complejo",
//             "Tecnicismos eléctricos innecesarios",
//             "Formalidad excesiva que dificulte comprensión"
//         ]
//     };
// };

// /**
//  * Obtiene las opciones disponibles para cada parámetro
//  * @returns {Object} Opciones para los selects del formulario
//  */
// export const getAvailableOptions = () => {
//     return {
//         tiposContenido: [
//             'Comunicado interno',
//             'Noticia institucional',
//             'Entrada de blog',
//             'Resumen de evento',
//             'Anuncio'
//         ],
//         publicosObjetivo: [
//             'Estudiantes',
//             'Docentes',
//             'Personal administrativo',
//             'Egresados',
//             'Toda la comunidad universitaria'
//         ],
//         tonos: [
//             'Formal institucional',
//             'Informativo claro',
//             'Motivacional',
//             'Urgente/Importante'
//         ],
//         longitudes: [
//             'corto (200-300 palabras)',
//             'mediano (400-600 palabras)',
//             'largo (700-1000 palabras)'
//         ]
//     };

// };

/**
 * Módulo de construcción de prompts para Comunicación Editorial Universitaria
 * Especializado en borradores para la Universidad Católica Santiago de Guayaquil
 */

/**
 * Construye un prompt estructurado para generación de contenido de comunicación universitaria
 * @param {Object} params - Parámetros de entrada del usuario
 * @returns {string} Prompt estructurado listo para enviar al modelo de IA
 * @throws {Error} Si los parámetros requeridos no están presentes
 */

export const buildEditorialPrompt = (params, contextoArchivo = '') => {

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

    // 2. Fecha actual para referencia
    const fechaActual = new Date();
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechaFormateada = `${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]} de ${fechaActual.getFullYear()}`;

    // 3. Construcción del prompt por secciones

    //  A: ROL Y CONTEXTO INSTITUCIONAL ESPECÍFICO
    let prompt = `Eres un redactor especializado en comunicación institucional de la Universidad Católica Santiago de Guayaquil (UCSG) con más de 8 años de experiencia en el departamento de comunicaciones. Tu expertise está en crear contenido claro, efectivo y apropiado para diferentes audiencias dentro del ecosistema universitario.\n\n`;

    prompt += `CONTEXTO INSTITUCIONAL OBLIGATORIO:
- Institución: Universidad Católica Santiago de Guayaquil (UCSG)
- Año de referencia para fechas: ${fechaActual.getFullYear()} (SIEMPRE usa el año actual a menos que se especifique otra cosa)
- Ciudad: Guayaquil, Ecuador
- Información de contacto genérica apropiada (cuando sea necesario):
  * Teléfono: +593 4-XXX-XXXX
  * Correo: comunicacion@ucsg.edu.ec
  * Sitio web: www.ucsg.edu.ec
  * Dirección: Av. Carlos Julio Arosemena Tola Km. 1.5 Vía a Daule
- Usa términos institucionales correctos: "UCSG", "nuestra universidad", "la comunidad ucsguita"\n\n`;

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
        prompt += `Mantenga un lenguaje profesional y respetuoso, apropiado para comunicaciones oficiales de la UCSG.\n`;
    } else if (tono === 'Informativo claro') {
        prompt += `Priorice la claridad y precisión. Sea directo y evite ambigüedades.\n`;
    } else if (tono === 'Motivacional') {
        prompt += `Incluya elementos inspiradores, reconozca logros y fomente participación en actividades UCSG.\n`;
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

    // 4. INSTRUCCIONES DE TEMPORALIDAD (CRÍTICO)
    prompt += `\nINSTRUCCIONES DE TEMPORALIDAD Y FECHAS:
- SIEMPRE usa el año actual (${fechaActual.getFullYear()}) para fechas futuras o presentes
- NUNCA uses años pasados como 2023, 2022, etc., a menos que sean históricos y relevantes
- Para fechas específicas no proporcionadas, usa fechas creíbles en ${fechaActual.getFullYear()} o ${fechaActual.getFullYear() + 1}
- La fecha de emisión del documento debe ser: ${fechaFormateada}
- Si el contenido menciona plazos, hazlos realistas y consistentes con el año actual\n`;

    // 5. ESTRUCTURA ESPECÍFICA SEGÚN TIPO DE CONTENIDO
    prompt += `\nESTRUCTURA REQUERIDA (adaptada al tipo de contenido):\n`;

    // Estructuras diferenciadas por tipo de contenido
    if (tipoContenido === 'Comunicado interno') {
        prompt += `1. ENCABEZADO OFICIAL UCSG: Logo institucional, "UNIVERSIDAD CATÓLICA SANTIAGO DE GUAYAQUIL"\n`;
        prompt += `2. ASUNTO/TÍTULO: Claro y descriptivo\n`;
        prompt += `3. SALUDO INSTITUCIONAL UCSG: Apropiado para los destinatarios\n`;
        prompt += `4. CUERPO PRINCIPAL:\n`;
        prompt += `Contexto breve\n`;
        prompt += `Información central (qué, cuándo, dónde, por qué)\n`;
        prompt += `Impacto en la comunidad universitaria UCSG\n`;
        prompt += `Instrucciones o pasos a seguir (si aplica)\n`;
        prompt += `5. INFORMACIÓN PRÁCTICA: Fechas, plazos, contactos UCSG, enlaces institucionales\n`;
        prompt += `6. CIERRE FORMAL UCSG:\n`;
        prompt += `7. FIRMA/RESPONSABLE: Departamento o autoridad UCSG correspondiente\n`;
    }
    else if (tipoContenido === 'Noticia institucional') {
        prompt += `1. TITULAR PERIODÍSTICO: Atractivo y preciso, incluyendo "UCSG" si es relevante\n`;
        prompt += `2. ENTRADILLA/LEAD: Resumen esencial (1-2 párrafos máximo)\n`;
        prompt += `3. CUERPO DE LA NOTICIA:\n`;
        prompt += `Desarrollo en orden decreciente de importancia\n`;
        prompt += `Citas relevantes de autoridades UCSG (si las hay)\n`;
        prompt += `Contexto institucional UCSG\n`;
        prompt += `Datos verificables\n`;
        prompt += `4. INFORMACIÓN ADICIONAL:\n`;
        prompt += `Antecedentes breves relacionados con la UCSG\n`;
        prompt += `Próximos pasos o implicaciones para la UCSG\n`;
        prompt += `5. DATOS DE CONTACTO UCSG: Para más información\n`;
    }
    else if (tipoContenido === 'Entrada de blog') {
        prompt += `1. TÍTULO ATRACTIVO: Que genere interés para la comunidad UCSG\n`;
        prompt += `2. INTRODUCCIÓN: Conectar con la experiencia universitaria UCSG\n`;
        prompt += `3. DESARROLLO:\n`;
        prompt += `Organizado en secciones con subtítulos\n`;
        prompt += `Lenguaje cercano pero profesional, reflejando valores UCSG\n`;
        prompt += `Ejemplos o casos relevantes de la UCSG\n`;
        prompt += `Reflexiones o análisis con perspectiva UCSG\n`;
        prompt += `4. CONCLUSIÓN: Síntesis y llamado a la reflexión/acción\n`;
        prompt += `5. PREGUNTA AL LECTOR: Para fomentar interacción en plataformas UCSG\n`;
    }
    else if (tipoContenido === 'Resumen de evento') {
        prompt += `1. TÍTULO DESCRIPTIVO: Incluir nombre del evento y fecha (año ${fechaActual.getFullYear()})\n`;
        prompt += `2. INFORMACIÓN BÁSICA UCSG: Qué, cuándo, dónde, quiénes (participantes UCSG)\n`;
        prompt += `3. DESARROLLO:\n`;
        prompt += `Puntos destacados del evento en la UCSG\n`;
        prompt += `Participantes o ponentes relevantes de la UCSG\n`;
        prompt += `Conclusiones principales\n`;
        prompt += `Momentos significativos\n`;
        prompt += `4. IMPACTO O LOGROS: Resultados o aprendizajes para la UCSG\n`;
        prompt += `5. PRÓXIMOS EVENTOS UCSG O SEGUIMIENTO:\n`;
        prompt += `6. GALERÍA DE FOTOS/ENLACES: (mencionar disponibilidad en medios UCSG)\n`;
    }
    else if (tipoContenido === 'Anuncio') {
        prompt += `1. TITULAR DIRECTO: Anunciando claramente para la comunidad UCSG\n`;
        prompt += `2. INFORMACIÓN ESENCIAL: De manera inmediatamente visible\n`;
        prompt += `3. DETALLES COMPLETOS UCSG:\n`;
        prompt += `Requisitos o condiciones específicas de la UCSG\n`;
        prompt += `Beneficios o características para estudiantes UCSG\n`;
        prompt += `Proceso a seguir en plataformas UCSG\n`;
        prompt += `4. PLAZOS Y FECHAS: Con claridad (usar ${fechaActual.getFullYear()})\n`;
        prompt += `5. LLAMADO A LA ACCIÓN: Instrucciones específicas para la UCSG\n`;
        prompt += `6. CONTACTOS Y ENLACES UCSG: Para más información\n`;
    }

    // 6. INSTRUCCIONES FINALES DE CALIDAD
    prompt += `\nINSTRUCCIONES DE CALIDAD EDITORIAL UCSG:\n`;
    prompt += `El borrador debe requerir solo ajustes menores de edición humana\n`;
    prompt += `Adapte el lenguaje al nivel de formalidad requerido por la audiencia UCSG\n`;
    prompt += `Use lenguaje inclusivo y accesible, apropiado para la UCSG\n`;
    prompt += `Evite la jerga burocrática innecesaria\n`;
    prompt += `Mantenga coherencia con la identidad institucional de la Universidad Católica Santiago de Guayaquil\n`;
    prompt += `Priorice la claridad sobre la complejidad\n`;
    prompt += `NO incluya placeholders como [datos por completar] o [fotos por añadir]\n`;
    prompt += `Si necesita referirse a datos específicos no proporcionados, hágalo de forma genérica pero creíble para la UCSG\n`;
    prompt += `NUNCA uses nombres de autoridades ficticias - refiérete genéricamente a "las autoridades UCSG", "el departamento correspondiente", etc.\n`;
    prompt += `Para información de contacto, usa los datos institucionales UCSG proporcionados arriba\n\n`;

    // 7. INTEGRACIÓN DE CONTEXTO ADICIONAL DE ARCHIVO (SI APLICA)
    if (contextoArchivo && contextoArchivo.trim()) {
        prompt += `\n\n--- CONTEXTO ADICIONAL DEL DOCUMENTO ADJUNTO ---\n`;
        prompt += `A continuación se proporciona texto extraído de un documento adjunto:\n\n`;
        prompt += `"${contextoArchivo}"\n\n`;
        prompt += `--- FIN DEL CONTEXTO ADJUNTO ---\n\n`;

        prompt += `**INSTRUCCIONES PARA USAR EL CONTEXTO ADJUNTO:**\n`;
        prompt += `1. ANALIZA el texto adjunto para extraer información RELEVANTE Y ACTUAL para "${temaPrincipal}"\n`;
        prompt += `2. Usa este texto SOLO como información de referencia o contexto adicional\n`;
        prompt += `3. Integre datos, cifras o información relevante SI es pertinente al tema principal y ACTUAL (${fechaActual.getFullYear()})\n`;
        prompt += `4. ACTUALIZA cualquier fecha antigua al contexto temporal actual de la UCSG\n`;
        prompt += `5. NO repita el texto adjunto palabra por palabra\n`;
        prompt += `6. SI el texto adjunto contiene información obsoleta (años pasados), adáptala al contexto actual\n`;
        prompt += `7. SI el texto adjunto NO es relevante para "${temaPrincipal}", ignórelo completamente\n`;
        prompt += `8. Priorice SIEMPRE los parámetros principales proporcionados arriba\n\n`;
    }

    prompt += `Por favor, genere el BORRADOR COMPLETO siguiendo estrictamente todas las especificaciones anteriores, enfocado en la Universidad Católica Santiago de Guayaquil (UCSG).`;

    return prompt;
};

/**
 * Genera parámetros de ejemplo para pruebas - COMUNICACIÓN UNIVERSITARIA UCSG
 * @returns {Object} Objeto con parámetros de ejemplo realistas
 */
export const getExampleParams = () => {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();

    return {
        tipoContenido: "Comunicado interno",
        publicoObjetivo: "Toda la comunidad universitaria UCSG (estudiantes, docentes, administrativos)",
        tono: "Informativo claro",
        temaPrincipal: "Suspensión temporal de actividades por mantenimiento del sistema eléctrico en campus UCSG",
        puntosClave: [
            `Fechas afectadas: 15 y 16 de noviembre de ${añoActual}`,
            `Horario: 8:00 AM a 6:00 PM ambos días`,
            `Áreas afectadas: Edificios A, B y C del campus central UCSG`,
            `Servicios que seguirán operando: Biblioteca digital UCSG, plataforma virtual`,
            `Contacto para emergencias: extensión 1234 o comunicacion@ucsg.edu.ec`,
            `Reanudación normal: 17 de noviembre de ${añoActual} a las 8:00 AM`
        ],
        longitudAproximada: "corto (200-300 palabras)",
        elementosExcluir: [
            "Lenguaje burocrático complejo",
            "Tecnicismos eléctricos innecesarios",
            "Formalidad excesiva que dificulte comprensión",
            "Nombres de autoridades ficticias",
            "Información de contacto no institucional"
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
            'Estudiantes UCSG',
            'Docentes UCSG',
            'Personal administrativo UCSG',
            'Egresados UCSG',
            'Toda la comunidad universitaria UCSG'
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
