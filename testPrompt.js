import { buildEditorialPrompt, getExampleParams, getAvailableOptions } from './src/modules/processing/promptBuilder.js';

console.log("=== OPCIONES DISPONIBLES ===");
const options = getAvailableOptions();
console.log("Tipos de contenido:", options.tiposContenido);
console.log("Públicos objetivo:", options.publicosObjetivo);
console.log("Tonos disponibles:", options.tonos);
console.log("\n");

console.log("=== EJEMPLO DE PARÁMETROS ===");
const exampleParams = getExampleParams();
console.log(JSON.stringify(exampleParams, null, 2));
console.log("\n");

console.log("=== PROMPT GENERADO ===");
const prompt = buildEditorialPrompt(exampleParams);
console.log(prompt);
console.log("\n");

console.log("=== ESTADÍSTICAS ===");
console.log(`Longitud del prompt: ${prompt.length} caracteres`);
console.log(`Número de líneas: ${prompt.split('\n').length}`);
console.log(`Palabras aproximadas: ${prompt.split(' ').length}`);
console.log("\n");

console.log("=== PREVISUALIZACIÓN (primeras 600 caracteres) ===");
console.log(prompt.substring(0, 600) + "...");