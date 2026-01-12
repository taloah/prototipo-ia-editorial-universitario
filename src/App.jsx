import React, { useState, useRef, useEffect } from 'react';
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
  HStack,
  Image
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

  const resultRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const toast = useToast();

  // Efecto para hacer scroll al resultado cuando se genera un nuevo borrador
  useEffect(() => {
    if (shouldScroll && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({
          behavior: 'smooth', block: 'start'
        });
      }, 100);
      setShouldScroll(false);
    }
  }, [shouldScroll, borrador, isLoading, error]);

  // Función PRINCIPAL: Generar borrador
  const handleGenerate = async (params, isRegenerate = false) => {
    // 1. Preparar estados
    setIsLoading(true);
    setError(null);
    setLastParams(params);

    if (!isRegenerate) {
      setShouldScroll(true);
    }


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
      handleGenerate(lastParams, true);
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
        {/* ENCABEZADO - Actualizado con colores institucionales */}
        <Box textAlign="center" pb={4}>
          <Image src="/logo-ucsg.png" alt="Logo UCSG" mb={6} margin="0 auto" display="block" />
          <Heading
            size="xl"
            color="institucional.azul"
            mb={2}
            position="relative"
            _after={{
              content: '""',
              display: 'block',
              width: '100px',
              height: '4px',
              bg: 'institucional.rojo',
              margin: '10px auto',
              borderRadius: '2px'
            }}
          >
            Generador de Contenido Editorial Universitario
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Prototipo de IA especializada en comunicación institucional de la UCSG.
          </Text>
        </Box>

        <Divider borderColor="gray.300" />

        {/* LAYOUT PRINCIPAL - Actualizado */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={8}
          height={{ lg: "calc(100vh - 200px)" }}
          minHeight="600px"
        >
          {/* COLUMNA IZQUIERDA: FORMULARIO - AZUL*/}

          <GridItem>
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
              borderWidth="2px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              borderColor="institucional.azul"
            >
              {/* Header del panel izquierdo - AZUL */}

              <Box
                p={4}
                bg="institucional.azul"
                color="white"
                borderBottom="2px solid"
                borderColor="institucional.azulOscuro"
              >
                <Heading size="md">📝 Parámetros del Contenido</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  Define las características del borrador
                </Text>
              </Box>

              {/* Contenido del formulario */}
              <Box p={6} flex="1" overflowY="auto">
                <ModuleInput onGenerate={handleGenerate} />
              </Box>

              {/* Footer del panel izquierdo */}
              <Box
                p={3}
                bg="institucional.azulBg"
                borderTop="2px solid"
                borderColor="institucional.azul"
                fontSize="sm"
              >
                <Text color="institucional.azul" fontWeight="medium">
                  💡 Completa todos los campos requeridos
                </Text>
              </Box>
            </Box>
          </GridItem>

          {/* COLUMNA DERECHA: RESULTADO - ROJO*/}
          <GridItem>
            <Box
              ref={resultRef}
              height="100%"
              display="flex"
              flexDirection="column"
              borderWidth="2px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              borderColor="institucional.rojo"
            >
              {/* Header del panel derecho - ROJO */}
              <Box
                p={4}
                bg="institucional.rojo"
                color="white"
                borderBottom="2px solid"
                borderColor="institucional.rojoOscuro"
              >
                <Heading size="md">📄 Borrador Generado</Heading>
                <Text fontSize="sm" opacity={0.9}>
                  Resultado del procesamiento por IA
                </Text>
              </Box>

              {/* Contenido del resultado */}
              <Box p={6} flex="1" overflowY="auto">
                <ModuleOutput
                  borrador={borrador}
                  isLoading={isLoading}
                  error={error}
                  onRegenerate={handleRegenerate}
                  metadata={{
                    title: "Borrador Editorial Universitario",
                    tipoContenido: lastParams?.tipoContenido,
                    publicoObjetivo: lastParams?.publicoObjetivo,
                    tono: lastParams?.tono,
                    longitudAproximada: lastParams?.longitudAproximada,
                    fechaGeneracion: new Date().toLocaleDateString()
                  }}

                />

                {/* Panel de información cuando no hay borrador */}
                {!borrador && !isLoading && !error && (
                  <Box
                    textAlign="center"
                    p={10}
                    bg="institucional.rojoBg"
                    borderRadius="lg"
                    border="2px dashed"
                    borderColor="institucional.rojo"
                  >
                    <Text fontSize="xl" color="institucional.rojo" mb={3}>
                      ⏳ Esperando para generar borrador
                    </Text>
                    <Text color="institucional.rojoOscuro">
                      Completa el formulario de la izquierda
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Footer del panel derecho */}
              <Box
                p={3}
                bg="institucional.rojoBg"
                borderTop="2px solid"
                borderColor="institucional.rojo"
                fontSize="sm"
              >
                <HStack justify="space-between">
                  <Text color="institucional.rojo" fontWeight="medium">
                    {borrador
                      ? `📊 ${borrador.split(/\s+/).length} palabras • ${borrador.length} caracteres`
                      : 'Listo para generar contenido'
                    }
                  </Text>
                  <Text color="institucional.rojoOscuro" fontSize="xs">
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
    </Container>
  );
}

export default App;