import React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    useClipboard,
    Alert,
    AlertIcon,
    Spinner,
    useToast
} from '@chakra-ui/react';
import { CopyIcon, RepeatIcon, DownloadIcon } from '@chakra-ui/icons';

const ModuleOutput = ({
    borrador,
    isLoading,
    error,
    onRegenerate
}) => {
    const toast = useToast();
    const { hasCopied, onCopy } = useClipboard(borrador || '');

    // Función para copiar con toast
    const handleCopy = () => {
        onCopy();
        toast({
            title: 'Copiado',
            description: 'Borrador copiado al portapapeles',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    // Función para descargar
    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([borrador], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `borrador-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        toast({
            title: 'Descargado',
            description: 'Borrador guardado como archivo .txt',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    // Estados de visualización
    if (isLoading) {
        return (
            <Box
                p={8}
                textAlign="center"
                borderWidth="2px"
                borderRadius="lg"
                borderColor="institucional.azul"
                borderStyle="dashed"
            >
                <VStack spacing={6}>
                    <Spinner size="xl" color="blue.500" />
                    <Text>Generando borrador con IA...</Text>
                </VStack>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                    <Text fontWeight="bold">Error al generar borrador</Text>
                    <Text fontSize="sm">{error}</Text>
                    {onRegenerate && (
                        <Button size="sm" mt={2} onClick={onRegenerate} colorScheme="red">
                            Reintentar
                        </Button>
                    )}
                </Box>
            </Alert>
        );
    }

    if (!borrador) {
        return null; // No mostrar nada si no hay contenido
    }

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            {/* Encabezado */}
            <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                <Heading size="md">📄 Borrador Generado</Heading>
            </Box>

            {/* Acciones */}
            <Box p={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                {/* Acciones debajo del contenido */}
                <HStack spacing={3}>
                    <Button
                        size="sm"
                        leftIcon={<CopyIcon />}
                        onClick={handleCopy}
                        variant="outlineAzul"  // Outline azul
                    >
                        {hasCopied ? '¡Copiado!' : 'Copiar'}
                    </Button>

                    <Button
                        size="sm"
                        leftIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        variant="outlineAzul"  // Outline azul
                    >
                        Descargar (.txt)
                    </Button>

                    {onRegenerate && (
                        <Button
                            size="sm"
                            leftIcon={<RepeatIcon />}
                            onClick={onRegenerate}
                            variant="institucionalRojo"  // Rojo institucional
                        >
                            Nueva Versión
                        </Button>
                    )}
                </HStack>
            </Box>

            {/* Contenido */}
            <Box p={4} flex="1" overflowY="auto">
                <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    whiteSpace="pre-wrap"
                    fontFamily="body"
                    lineHeight="1.6"
                    border="1px solid"
                    borderColor="gray.200"
                    minHeight="400px"
                    maxHeight="500px"
                    overflowY="auto"
                >
                    {borrador}
                </Box>
            </Box>
        </Box>
    );
};

export default ModuleOutput;