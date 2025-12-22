import { buildEditorialPrompt, getExampleParams } from './src/modules/processing/promptBuilder.js';

// Prueba con parámetros de ejemplo
const exampleParams = getExampleParams();
const prompt = buildEditorialPrompt(exampleParams);

console.log("=== PROMPT GENERADO ===");
console.log(prompt);
console.log("\n=== ESTADÍSTICAS ===");
console.log(`Longitud del prompt: ${prompt.length} caracteres`);
console.log(`Número de líneas: ${prompt.split('\n').length}`);
console.log("\n=== PREVISUALIZACIÓN (primeras 500 chars) ===");
console.log(prompt.substring(0, 500) + "...");