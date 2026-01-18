
/**
 * Genera un borrador usando modelos de Microsoft Foundry
 * @param {string} prompt - Prompt estructurado completo
 * @returns {Promise<string>} - Respuesta del modelo (borrador generado)
 */
export const generateWithFoundry = async (prompt) => {
    // 1. Obtener credenciales desde variables de entorno
    const endpoint = import.meta.env.VITE_FOUNDRY_ENDPOINT;
    const apiKey = import.meta.env.VITE_FOUNDRY_API_KEY;
    const modelName = import.meta.env.VITE_FOUNDRY_MODEL_NAME || 'Router';

    console.log('🔧 Configuración Foundry:', { endpoint, modelName, apiKey: apiKey ? '✅ Presente' : '❌ Faltante' });

    // 2. Validar que tenemos las credenciales necesarias
    if (!endpoint || !apiKey) {
        const errorMsg = 'Credenciales de Foundry incompletas. Revisa tu archivo .env.local';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        // 3. Preparar el cuerpo de la solicitud
        const requestBody = {
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: "Eres un redactor especializado en comunicación institucional universitaria. Genera borradores claros, concisos y listos para revisión. Responde ÚNICAMENTE con el contenido del borrador solicitado, sin comentarios adicionales."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,      // Control de creatividad: 0 (determinista) a 1 (creativo)
            max_tokens: 2000,      // Límite de longitud de respuesta
            top_p: 0.9,           // Control de diversidad
            frequency_penalty: 0,  // Penaliza tokens frecuentes
            presence_penalty: 0.1  // Penaliza tokens repetidos
        };

        console.log('Enviando solicitud a Foundry...');
        console.log('Prompt (primeros 300 chars):', prompt.substring(0, 300) + '...');

        // 4. Enviar la solicitud HTTP
        const startTime = Date.now();
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

                'Authorization': `Bearer ${apiKey}`,      // Opción 1
            },
            body: JSON.stringify(requestBody)
        });
        const requestTime = Date.now() - startTime;

        console.log(`Tiempo de respuesta: ${requestTime}ms`);
        console.log(`Status: ${response.status} ${response.statusText}`);

        // 5. Manejar la respuesta
        if (!response.ok) {
            let errorDetail = `HTTP ${response.status}`;
            try {
                const errorData = await response.text();
                console.error('Detalles del error:', errorData);
                errorDetail += ` - ${errorData.substring(0, 200)}`;
            } catch (e) {
                console.warn('No se pudo leer el cuerpo del error');
            }

            throw new Error(`Error del servidor Foundry: ${errorDetail}`);
        }

        // 6. Procesar la respuesta exitosa
        const responseData = await response.json();
        console.log('✅ Respuesta recibida de Foundry:', responseData);

        // 7. EXTRAER LA RESPUESTA - Esta es la parte MÁS IMPORTANTE
        let borradorGenerado = '';

        // Patrón 1: Estilo OpenAI (más común)
        if (responseData.choices && responseData.choices[0]?.message?.content) {
            borradorGenerado = responseData.choices[0].message.content;
        }
        // Patrón 2: Respuesta directa
        else if (responseData.content) {
            borradorGenerado = responseData.content;
        }
        // Patrón 3: Texto plano
        else if (responseData.text) {
            borradorGenerado = responseData.text;
        }
        // Patrón 4: Respuesta en raíz
        else if (responseData.response) {
            borradorGenerado = responseData.response;
        }
        // Patrón 5: Array de mensajes
        else if (Array.isArray(responseData.messages)) {
            const lastMessage = responseData.messages[responseData.messages.length - 1];
            borradorGenerado = lastMessage.content || JSON.stringify(lastMessage);
        }
        else {
            console.warn('Estructura de respuesta no reconocida. Data completa:', responseData);
            borradorGenerado = `[Estructura de respuesta inesperada. Revisa la consola para detalles.]\n\nModelo: ${modelName}\nRespuesta en crudo: ${JSON.stringify(responseData, null, 2).substring(0, 500)}...`;
        }

        console.log(`Borrador extraído (${borradorGenerado.length} caracteres):`, borradorGenerado.substring(0, 200) + '...');

        return borradorGenerado;

    } catch (error) {
        console.error('Error en generateWithFoundry:', error);

        const errorMessage = error.message.includes('Failed to fetch')
            ? `Error de conexión: No se pudo contactar con Foundry. Verifica:
         1. El endpoint (${endpoint})
         2. Tu conexión a internet
         3. Que no haya problemas de CORS (revisa la consola del navegador)`
            : `Error con Foundry: ${error.message}`;

        throw new Error(errorMessage);
    }
};