import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  Badge,
  HStack
} from '@chakra-ui/react';

// Importaciones de Módulos
import ModuleInput from './components/ModuleInput';
import ModuleOutput from './components/ModuleOutput';
import { buildEditorialPrompt } from './modules/processing/promptBuilder';
import { generateWithFoundry } from './modules/api/client';

function App() {
  // Estados PRINCIPALES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [borrador, setBorrador] = useState('');
  const [lastParams, setLastParams] = useState(null);
  //const [generationCount, setGenerationCount] = useState(0);

  const toast = useToast();

  // Función PRINCIPAL: Generar borrador
  const handleGenerate = async (params) => {
    // 1. Preparar estados
    setIsLoading(true);
    setError(null);
    setLastParams(params);

    try {
      // 2. Construir prompt
      const prompt = buildEditorialPrompt(params);
      console.log('Prompt construido:', prompt.substring(0, 150) + '...');

      // 3. Llamar a Foundry
      const respuesta = await generateWithFoundry(prompt);

      // 4. Guardar resultado
      setBorrador(respuesta);
      //setGenerationCount(prev => prev + 1);

      // 5. Feedback sutil (no toast intrusivo)
      console.log('✅ Borrador generado exitosamente');

    } catch (err) {
      // 6. Manejar errores
      console.error('Error en handleGenerate:', err);
      setError(err.message || 'Error desconocido');
      setBorrador('');

    } finally {
      // 7. Siempre detener loading
      setIsLoading(false);
    }
  };

  // Función para regenerar con mismos parámetros
  const handleRegenerate = () => {
    if (lastParams) {
      handleGenerate(lastParams);
    } else {
      toast({
        title: 'Genera un borrador primero',
        status: 'info',
        duration: 2000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6} align="stretch">
        {/* ENCABEZADO */}
        <Box textAlign="center" pb={4}>
          <Heading size="xl" color="blue.800" mb={2}>
            🎓 Generador de Contenido Editorial Universitario
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Prototipo de IA especializada en comunicación institucional
          </Text>
          {/* <HStack justify="center" mt={3} spacing={4}>
            <Badge colorScheme="blue" fontSize="0.9em">
              Modelo: {import.meta.env.VITE_FOUNDRY_MODEL_NAME || 'Desconocido'}
            </Badge>
            <Badge colorScheme="green" fontSize="0.9em">
              Generaciones: {generationCount}
            </Badge>
            <Badge colorScheme="purple" fontSize="0.9em">
              {borrador ? 'Borrador listo' : 'Esperando parámetros'}
            </Badge>
          </HStack> */}
        </Box>

        <Divider />

        {/* LAYOUT PRINCIPAL: GRID DE 2 COLUMNAS */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={8}
          height={{ lg: "calc(100vh - 200px)" }}
          minHeight="600px"
        >
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <GridItem>
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
            >
              {/* Header del panel izquierdo */}
              <Box
                p={4}
                bg="blue.600"
                color="white"
                borderBottom="1px solid"
                borderColor="blue.700"
              >
                <Heading size="md">📝 Parámetros del Contenido</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  Define las características del borrador
                </Text>
              </Box>

              {/* Contenido del formulario - con scroll si es necesario */}
              <Box p={6} flex="1" overflowY="auto">
                <ModuleInput onGenerate={handleGenerate} />
              </Box>

              {/* Footer del panel izquierdo */}
              <Box
                p={3}
                bg="blue.50"
                borderTop="1px solid"
                borderColor="gray.200"
                fontSize="sm"
              >
                <Text color="gray.600">
                  💡 Completa todos los campos requeridos y haz clic en "Generar Borrador"
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* COLUMNA DERECHA: RESULTADO */}
          <GridItem>
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
            >
              {/* Header del panel derecho */}
              <Box
                p={4}
                bg="green.600"
                color="white"
                borderBottom="1px solid"
                borderColor="green.700"
              >
                <Heading size="md">📄 Borrador Generado</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  Resultado del procesamiento por IA
                </Text>
              </Box>

              {/* Contenido del resultado - ocupa todo el espacio disponible */}
              <Box p={6} flex="1" overflowY="auto">
                <ModuleOutput
                  borrador={borrador}
                  isLoading={isLoading}
                  error={error}
                  onRegenerate={handleRegenerate}
                />

                {/* Panel de información cuando no hay borrador */}
                {!borrador && !isLoading && !error && (
                  <Box
                    textAlign="center"
                    p={10}
                    bg="gray.50"
                    borderRadius="lg"
                    border="2px dashed"
                    borderColor="gray.300"
                  >
                    <Text fontSize="xl" color="gray.500" mb={3}>
                      ⏳ Esperando para generar borrador
                    </Text>
                    <Text color="gray.600">
                      Completa el formulario de la izquierda y haz clic en "Generar Borrador"
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={4}>
                      El resultado aparecerá aquí automáticamente
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Footer del panel derecho */}
              <Box
                p={3}
                bg="green.50"
                borderTop="1px solid"
                borderColor="gray.200"
                fontSize="sm"
              >
                <HStack justify="space-between">
                  <Text color="gray.600">
                    {borrador
                      ? `📊 ${borrador.split(/\s+/).length} palabras • ${borrador.length} caracteres`
                      : 'Listo para generar contenido'
                    }
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {lastParams
                      ? `Último: ${lastParams.tipoContenido || 'Sin tipo'}`
                      : 'Sin generaciones previas'
                    }
                  </Text>
                </HStack>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container >
  );
}

export default App;