import React, { useState } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Select,
    Textarea,
    Input,
    Button,
    VStack,
    HStack,
    IconButton,
    Tag,
    TagLabel,
    TagCloseButton,
    Heading,
    Text,
    useToast,
    FormErrorMessage,
    Progress
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, AttachmentIcon } from '@chakra-ui/icons';
import { getAvailableOptions } from '../../modules/processing/promptBuilder';
import { analyzeExtractedText, extractTextFromFile, validateTextFile } from '../../utils/fileProcessor';


const ModuleInput = ({ onGenerate }) => {

    // 1. Estados para cada campo del formulario

    const [tipoContenido, setTipoContenido] = useState('');
    const [publicoObjetivo, setPublicoObjetivo] = useState('');
    const [tono, setTono] = useState('');
    const [temaPrincipal, setTemaPrincipal] = useState('');
    const [puntoClaveInput, setPuntoClaveInput] = useState('');
    const [puntosClave, setPuntosClave] = useState([]);
    const [longitudAproximada, setLongitudAproximada] = useState('');
    const [elementoExcluirInput, setElementoExcluirInput] = useState('');
    const [elementosExcluir, setElementosExcluir] = useState([]);

    // Estados para manejo de archivos subidos
    const [archivo, setArchivo] = useState(null);
    const [archivoTexto, setArchivoTexto] = useState('');
    const [archivoError, setArchivoError] = useState('');
    const [isProcesandoArchivo, setIsProcesandoArchivo] = useState(false);
    const [archivoMetadata, setArchivoMetadata] = useState(null);

    const toast = useToast();
    const options = getAvailableOptions();

    // 2. Funciones para manejar arrays dinámicos

    const addPuntoClave = () => {
        if (puntoClaveInput.trim()) {
            setPuntosClave([...puntosClave, puntoClaveInput.trim()]);
            setPuntoClaveInput('');
        }
    };

    const removePuntoClave = (index) => {
        setPuntosClave(puntosClave.filter((_, i) => i !== index));
    };

    const addElementoExcluir = () => {
        if (elementoExcluirInput.trim()) {
            setElementosExcluir([...elementosExcluir, elementoExcluirInput.trim()]);
            setElementoExcluirInput('');
        }
    };

    const removeElementoExcluir = (index) => {
        setElementosExcluir(elementosExcluir.filter((_, i) => i !== index));
    };

    // 2.1. Función para manejar selección de archivo

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Resetear estados
        setArchivoError('');
        setArchivoTexto('');
        setArchivoMetadata(null);
        setIsProcesandoArchivo(true);

        // Validar archivo
        const validation = validateTextFile(file);
        if (!validation.isValid) {
            setArchivoError(validation.error);
            setIsProcesandoArchivo(false);
            return;
        }

        try {
            // Extraer texto
            const texto = await extractTextFromFile(file);
            setArchivo(file);
            setArchivoTexto(texto);

            // Analizar metadata
            const metadata = analyzeExtractedText(texto);
            setArchivoMetadata(metadata);

        } catch (error) {
            setArchivoError(error.message);
            setArchivo(null);
            setArchivoTexto('');
        } finally {
            setIsProcesandoArchivo(false);
        }
    };

    // Función para remover archivo
    const handleRemoveFile = () => {
        setArchivo(null);
        setArchivoTexto('');
        setArchivoMetadata(null);
        setArchivoError('');
        // Resetear input file
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    };

    // 3. Validacion de formulario

    const validateForm = () => {
        const errors = [];

        if (!tipoContenido) errors.push('Tipo de contenido');
        if (!publicoObjetivo) errors.push('Público objetivo');
        if (!tono) errors.push('Tono');
        if (!temaPrincipal.trim()) errors.push('Tema principal');
        if (!longitudAproximada) errors.push('Longitud aproximada');

        return errors;
    };

    // 4. Manejo de envío del formulario

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (errors.length > 0) {
            toast({
                title: 'Campos requeridos',
                description: `Complete los siguientes campos: ${errors.join(', ')}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Objetos de parámetros a enviar

        const params = {
            tipoContenido,
            publicoObjetivo,
            tono,
            temaPrincipal,
            puntosClave,
            longitudAproximada,
            elementosExcluir
        };

        onGenerate(params, archivoTexto);
    };

    // 5. Renderizado del formulario

    return (
        <Box as="form" onSubmit={handleSubmit} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="lg" mb={6} color="blue.700">
                Parámetros del Borrador
            </Heading>

            <VStack spacing={4} align="stretch">
                <Text color="gray.600" fontSize="sm">
                    Complete los siguientes campos para generar un borrador de contenido editorial universitario.
                </Text>

                {/* Campo 1: Tipo de Contenido */}

                <FormControl isRequired>
                    <FormLabel>Tipo de contenido</FormLabel>
                    <Select
                        placeholder="Seleccione el tipo de contenido"
                        value={tipoContenido}
                        onChange={(e) => setTipoContenido(e.target.value)}
                        bg="white"
                    >
                        {options.tiposContenido.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </Select>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Define el formato y estructura del borrador
                    </Text>
                </FormControl>

                {/* Campo 2: Público Objetivo */}
                <FormControl isRequired>
                    <FormLabel>Destinatarios principales</FormLabel>
                    <Select
                        placeholder="Seleccione el público objetivo"
                        value={publicoObjetivo}
                        onChange={(e) => setPublicoObjetivo(e.target.value)}
                        bg="white"
                    >
                        {options.publicosObjetivo.map((publico, index) => (
                            <option key={index} value={publico}>{publico}</option>
                        ))}
                    </Select>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        A quién va dirigido el contenido
                    </Text>
                </FormControl>

                {/* Campo 3: Tono */}
                <FormControl isRequired>
                    <FormLabel>Tono del contenido</FormLabel>
                    <Select
                        placeholder="Seleccione el tono"
                        value={tono}
                        onChange={(e) => setTono(e.target.value)}
                        bg="white"
                    >
                        {options.tonos.map((tonoOpt, index) => (
                            <option key={index} value={tonoOpt}>{tonoOpt}</option>
                        ))}
                    </Select>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Define la actitud y estilo del lenguaje
                    </Text>
                </FormControl>

                {/* Campo 4: Tema Principal */}
                <FormControl isRequired>
                    <FormLabel>Tema principal</FormLabel>
                    <Textarea
                        placeholder="Describa el tema central del contenido..."
                        value={temaPrincipal}
                        onChange={(e) => setTemaPrincipal(e.target.value)}
                        rows={4}
                        bg="white"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        El núcleo de lo que quiere comunicar. Sea claro y específico.
                    </Text>
                </FormControl>

                {/* Campo 5: Puntos Clave (Array dinámico) */}
                <FormControl>
                    <FormLabel>Información específica a incluir</FormLabel>
                    <HStack mb={2}>
                        <Input
                            placeholder="Ej: Fechas, datos, contactos, detalles importantes..."
                            value={puntoClaveInput}
                            onChange={(e) => setPuntoClaveInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPuntoClave())}
                            bg="white"
                        />
                        <IconButton
                            icon={<AddIcon />}
                            onClick={addPuntoClave}
                            variant="institucionalAzul"
                            aria-label="Añadir punto clave"
                        />
                    </HStack>

                    {/* Lista de puntos clave añadidos */}
                    <Box mt={2}>
                        {puntosClave.map((punto, index) => (
                            <Tag
                                key={index}
                                size="md"
                                borderRadius="full"
                                variant="solid"
                                colorScheme="green"
                                m={1}
                            >
                                <TagLabel>{punto}</TagLabel>
                                <TagCloseButton onClick={() => removePuntoClave(index)} />
                            </Tag>
                        ))}
                    </Box>

                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Añada datos concretos que deben aparecer en el borrador
                    </Text>
                </FormControl>

                {/* Campo 6: Longitud */}
                <FormControl isRequired>
                    <FormLabel>Longitud aproximada</FormLabel>
                    <Select
                        placeholder="Seleccione la longitud"
                        value={longitudAproximada}
                        onChange={(e) => setLongitudAproximada(e.target.value)}
                        bg="white"
                    >
                        {options.longitudes.map((longitud, index) => (
                            <option key={index} value={longitud}>{longitud}</option>
                        ))}
                    </Select>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Extensión estimada del borrador final
                    </Text>
                </FormControl>

                {/* Campo 7: Elementos a Excluir (Array dinámico) */}
                <FormControl>
                    <FormLabel>Elementos de estilo a evitar</FormLabel>
                    <HStack mb={2}>
                        <Input
                            placeholder="Ej: Jerga técnica, formalidad excesiva, lenguaje complejo..."
                            value={elementoExcluirInput}
                            onChange={(e) => setElementoExcluirInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addElementoExcluir())}
                            bg="white"
                        />
                        <IconButton
                            icon={<AddIcon />}
                            onClick={addElementoExcluir}
                            variant="institucionalAzul"
                            aria-label="Añadir elemento a excluir"
                        />
                    </HStack>

                    {/* Lista de elementos a excluir */}
                    <Box mt={2}>
                        {elementosExcluir.map((elemento, index) => (
                            <Tag
                                key={index}
                                size="md"
                                borderRadius="full"
                                variant="solid"
                                colorScheme="red"
                                m={1}
                            >
                                <TagLabel>{elemento}</TagLabel>
                                <TagCloseButton onClick={() => removeElementoExcluir(index)} />
                            </Tag>
                        ))}
                    </Box>

                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Aspectos del lenguaje o estilo que no deben aparecer
                    </Text>
                </FormControl>

                {/* Campo para archivo (OPCIONAL) */}
                <FormControl>
                    <FormLabel>
                        <HStack>
                            <AttachmentIcon />
                            <Text>Documento de referencia (opcional)</Text>
                        </HStack>
                    </FormLabel>

                    <VStack align="stretch" spacing={3}>
                        {/* Input file oculto con botón personalizado */}
                        <Input
                            id="file-input"
                            type="file"
                            accept=".txt,.md,.csv,.json"
                            onChange={handleFileSelect}
                            display="none"
                        />

                        <Button
                            as="label"
                            htmlFor="file-input"
                            variant="outline"
                            cursor="pointer"
                            leftIcon={<AttachmentIcon />}
                            isLoading={isProcesandoArchivo}
                            loadingText="Procesando..."
                            width="full"
                        >
                            Seleccionar archivo (.txt, .md, .csv)
                        </Button>

                        <Text fontSize="xs" color="gray.600" textAlign="center">
                            Máx. 50KB • Solo texto plano • Información será usada como contexto
                        </Text>

                        {/* Mostrar archivo seleccionado */}
                        {archivo && (
                            <Box
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor="green.200"
                                bg="green.50"
                            >
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="medium">
                                        📎 {archivo.name}
                                    </Text>
                                    <IconButton
                                        icon={<CloseIcon />}
                                        size="xs"
                                        onClick={handleRemoveFile}
                                        aria-label="Remover archivo"
                                        variant="ghost"
                                    />
                                </HStack>

                                {archivoMetadata && (
                                    <VStack align="stretch" spacing={1}>
                                        <Text fontSize="xs">
                                            📊 {archivoMetadata.words} palabras • {archivoMetadata.lines} líneas
                                            {archivoMetadata.isTruncated && ' • (truncado)'}
                                        </Text>
                                        <Text fontSize="xs" color="gray.600" fontStyle="italic">
                                            "{archivoMetadata.preview}"
                                        </Text>
                                    </VStack>
                                )}
                            </Box>
                        )}

                        {/* Mostrar errores */}
                        {archivoError && (
                            <Alert status="warning" size="sm" borderRadius="md">
                                <AlertIcon boxSize="12px" />
                                <Text fontSize="xs">{archivoError}</Text>
                            </Alert>
                        )}
                    </VStack>
                </FormControl>

                {/* Botón de Generar */}
                <Button
                    type="submit"
                    variant="institucionalRojo"  // Usamos la variante roja
                    size="lg"
                    width="full"
                    mt={6}
                    height="60px"
                    fontSize="lg"
                    isLoading={false}
                    loadingText="Generando..."
                    boxShadow="md"
                    _hover={{
                        boxShadow: 'xl',
                        transform: 'translateY(-2px)'
                    }}
                >
                    🚀 Generar Borrador
                </Button>
            </VStack>
        </Box>
    );
};

export default ModuleInput;