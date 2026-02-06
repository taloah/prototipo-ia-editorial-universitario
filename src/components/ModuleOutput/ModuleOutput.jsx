import React from 'react';
import { downloadAsDocx } from '../../utils/docxGenerador';
import { AttachmentIcon } from '@chakra-ui/icons'
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
import { CopyIcon, RepeatIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons';

const ModuleOutput = ({
    borrador,
    isLoading,
    error,
    onRegenerate,
    metadata = {}
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

    // Función para descargar como HTML
    const handleDownloadHtml = () => {
        if (!borrador) return;

        // Convertir texto plano a HTML estructurado
        const convertToHtml = (text) => {
            const lines = text.split('\n');
            let htmlContent = '';
            let inList = false;

            lines.forEach(line => {
                const trimmedLine = line.trim();

                // Detectar encabezados (líneas en mayúsculas o que terminan con :)
                if (trimmedLine && (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && !/^[\d\-•]/.test(trimmedLine))) {
                    if (inList) {
                        htmlContent += '</ul>\n';
                        inList = false;
                    }
                    htmlContent += `<h2>${trimmedLine}</h2>\n`;
                }
                // Detectar listas (líneas que empiezan con -, •, * o números)
                else if (/^[\-•\*]\s/.test(trimmedLine) || /^\d+[\.\)]\s/.test(trimmedLine)) {
                    if (!inList) {
                        htmlContent += '<ul>\n';
                        inList = true;
                    }
                    const listContent = trimmedLine.replace(/^[\-•\*\d\.\)]\s*/, '');
                    htmlContent += `  <li>${listContent}</li>\n`;
                }
                // Líneas vacías
                else if (!trimmedLine) {
                    if (inList) {
                        htmlContent += '</ul>\n';
                        inList = false;
                    }
                }
                // Párrafos normales
                else {
                    if (inList) {
                        htmlContent += '</ul>\n';
                        inList = false;
                    }
                    htmlContent += `<p>${trimmedLine}</p>\n`;
                }
            });

            if (inList) {
                htmlContent += '</ul>\n';
            }

            return htmlContent;
        };

        const title = metadata.title || 'Borrador Editorial Universitario';
        const fecha = new Date().toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const htmlDocument = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.8;
            color: #333;
            background-color: #fafafa;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #003366;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #003366;
            font-size: 1.8em;
            margin-bottom: 10px;
        }
        .metadata {
            color: #666;
            font-size: 0.9em;
            font-style: italic;
        }
        h2 {
            color: #003366;
            font-size: 1.3em;
            margin-top: 25px;
            margin-bottom: 15px;
            border-left: 4px solid #cc0000;
            padding-left: 15px;
        }
        p {
            text-align: justify;
            margin-bottom: 15px;
        }
        ul {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 0.85em;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p class="metadata">Generado el ${fecha}</p>
    </div>
    
    <main>
${convertToHtml(borrador)}
    </main>
    
    <div class="footer">
        <p>Documento generado por Prototipo IA Editorial Universitario - UCSG</p>
    </div>
</body>
</html>`;

        const element = document.createElement('a');
        const file = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `borrador-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        toast({
            title: 'Descargado',
            description: 'Borrador guardado como archivo .html',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    //Funcion para descargar como docx
    const handleDownloadDocx = async () => {
        if (!borrador) return;
        try {
            const filename = `borrador-editorial-${new Date().toISOString().split('T')[0]}`;
            const success = await downloadAsDocx(borrador, filename, metadata);

            if (success) {
                toast({
                    title: 'Documento .docx generado',
                    description: 'Descargando archivo de Word',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            console.error('Error descargando DOCX:', err);
            toast({
                title: 'Error al generar .docx',
                description: 'Se descargará como .txt en su lugar',
                status: 'warning',
                duration: 4000,
                isClosable: true,
            });
            // Fallback a .txt
            handleDownload();
        }
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

                    {/* Botón .docx (NUEVO) */}
                    <Button
                        size="sm"
                        leftIcon={<AttachmentIcon />}
                        onClick={handleDownloadDocx}
                        variant="institucionalAzul"
                        colorScheme="blue"
                    >
                        Word (.docx)
                    </Button>

                    {/* Botón .html */}
                    <Button
                        size="sm"
                        leftIcon={<ExternalLinkIcon />}
                        onClick={handleDownloadHtml}
                        variant="outlineAzul"
                    >
                        HTML
                    </Button>

                    {/* Botón .txt */}
                    <Button
                        size="sm"
                        leftIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        variant="outlineAzul"
                    >
                        Texto (.txt)
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