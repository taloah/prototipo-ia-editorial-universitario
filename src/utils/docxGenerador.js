import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";

/**
 * Convierte un borrador de texto en un documento .docx estructurado.
 * @param {string} borrador - El texto del borrador a convertir.
 * @param {Object} metadata - Metadatos adicionales para el documento.
 * @returns {Promise<Blob>} - Documento .docx como Blob.
 */

export const generateDocx = async (borrador, metadata = {}) => {
    try {
        // Parsear el borrador para detectar estructura básica
        const paragraphs = parseBorradorToParagraphs(borrador);

        // Crear el documento
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Título principal
                    new Paragraph({
                        text: metadata.title || "Borrador Editorial Universitario",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),

                    // Metadatos (si existen)
                    ...generateMetadataParagraphs(metadata),

                    // Línea separadora
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "―".repeat(60),
                                color: "666666",
                                size: 20,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 300, after: 300 },
                    }),

                    // Contenido del borrador
                    ...paragraphs,

                    // Pie de página
                    new Paragraph({
                        text: `Generado el ${new Date().toLocaleDateString()} • Prototipo IA Editorial Universitario`,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 600 },
                        style: "footer",
                    }),
                ],
            }],
            styles: {
                paragraphStyles: [
                    {
                        id: "footer",
                        name: "Footer",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            color: "666666",
                            size: 20, // 10pt
                            italics: true,
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 240 }, // 1.5 interlineado
                        },
                    },
                    {
                        id: "quote",
                        name: "Quote",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            italics: true,
                        },
                        paragraph: {
                            indent: { left: 720 }, // 0.5 pulgadas
                            spacing: { before: 200, after: 200 },
                        },
                    },
                ],
            },
        });

        // Generar el Blob
        const blob = await Packer.toBlob(doc);
        return blob;

    } catch (error) {
        console.error("Error generando DOCX:", error);
        throw new Error("No se pudo generar el documento .docx");
    }
};

/**
 * Parsea el borrador de texto a párrafos estructurados para docx
 */
const parseBorradorToParagraphs = (borrador) => {
    if (!borrador) return [];

    const paragraphBlocks = borrador.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
    const paragraphs = [];

    for (const block of paragraphBlocks) {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length === 0) continue;

        const firstLine = lines[0];

        // Detectar títulos (líneas que terminan con : o empiezan con #)
        if (firstLine.match(/^[A-ZÁÉÍÓÚÑ\s]+:$/) ||
            firstLine.match(/^#{1,3}\s/) ||
            firstLine.match(/^[IVXLCDM]+\./i)) {

            paragraphs.push(new Paragraph({
                text: firstLine.replace(/^#+\s/, '').replace(/:$/, ''),
                heading: determineHeadingLevel(firstLine),
                spacing: { before: 300, after: 150 },
            }));

            // Agregar líneas restantes como párrafos normales
            for (let i = 1; i < lines.length; i++) {
                paragraphs.push(new Paragraph({
                    text: lines[i],
                    spacing: { before: 150, after: 150 },
                }));
            }
        }

        // Detectar listas
        else if (firstLine.match(/^[*\-•]\s/) || firstLine.match(/^\d+\.\s/)) {
            paragraphs.push(new Paragraph({
                text: block,
                bullet: { level: 0 },
                spacing: { before: 100, after: 100 },
            }));
        }

        // Detectar citas o texto especial
        else if (firstLine.startsWith('>') || firstLine.startsWith('"')) {
            paragraphs.push(new Paragraph({
                text: block.replace(/^[>"]\s*/, ''),
                style: "quote",
                spacing: { before: 200, after: 200 },
            }));
        }

        // Párrafo normal
        else {
            const text = lines.join(' ');
            paragraphs.push(new Paragraph({
                text: text,
                spacing: { before: 150, after: 150 },
            }));
        }
    }

    return paragraphs;
};

/**
 * Determina el nivel de heading basado en el texto
 */
const determineHeadingLevel = (text) => {
    if (text.match(/^#{3}\s/) || text.match(/^[IVXLCDM]+\./i)) {
        return HeadingLevel.HEADING_3;
    } else if (text.match(/^#{2}\s/) || text.match(/^[A-Z][A-Za-z\s]+:$/)) {
        return HeadingLevel.HEADING_2;
    } else {
        return HeadingLevel.HEADING_1;
    }
};

/**
 * Genera párrafos de metadatos si están disponibles
 */
const generateMetadataParagraphs = (metadata) => {
    const paragraphs = [];

    if (metadata.tipoContenido || metadata.publicoObjetivo) {
        paragraphs.push(new Paragraph({
            text: `Tipo: ${metadata.tipoContenido || 'No especificado'} | Público: ${metadata.publicoObjetivo || 'No especificado'}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
        }));
    }

    if (metadata.tono || metadata.longitudAproximada) {
        paragraphs.push(new Paragraph({
            text: `Tono: ${metadata.tono || 'No especificado'} | Extensión: ${metadata.longitudAproximada || 'No especificado'}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }));
    }

    return paragraphs;
};

/**
 * Función conveniente para descargar directamente
 */
export const downloadAsDocx = async (borrador, filename, metadata = {}) => {
    try {
        const blob = await generateDocx(borrador, metadata);

        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
        document.body.appendChild(link);
        link.click();

        // Limpiar
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);

        return true;
    } catch (error) {
        console.error("Error descargando DOCX:", error);
        return false;
    }
};