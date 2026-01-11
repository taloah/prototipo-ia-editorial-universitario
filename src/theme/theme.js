import { extendTheme, IconButton } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        institucional: {
            rojo: '#A20147',
            azul: '#2852A5',

            rojoClaro: '#C1236A',
            rojoOscuro: '#8A003A',
            azulClaro: '#4A73D6',
            azulOscuro: '#1E3C8C',

            rojoBg: '#FCE4EC',
            azulBg: '#E8EAF6',
        }
    },
    components: {
        Button: {
            variants: {

                institucionalRojo: {
                    bg: 'institucional.rojo',
                    color: 'white',
                    _hover: {
                        bg: 'institucional.rojoClaro',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    },
                    _active: {
                        bg: 'institucional.rojoOscuro',
                    },
                },
                institucionalAzul: {
                    bg: 'institucional.azul',
                    color: 'white',
                    _hover: {
                        bg: 'institucional.azulClaro',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    },
                    _active: {
                        bg: 'institucional.azulOscuro',
                    },
                },
                outlineRojo: {
                    borderColor: 'institucional.rojo',
                    color: 'institucional.rojo',
                    _hover: {
                        bg: 'institucional.rojoBg',
                    },
                },
                outlineAzul: {
                    borderColor: 'institucional.azul',
                    color: 'institucional.azul',
                    _hover: {
                        bg: 'institucional.azulBg',
                    },
                },
            },
        },
        Badge: {
            variants: {
                institucionalAzul: {
                    bg: 'institucional.azulBg',
                    color: 'institucional.azul',
                    border: '1px solid',
                    borderColor: 'institucional.azul',
                },
                institucionalRojo: {
                    bg: 'institucional.rojoBg',
                    color: 'institucional.rojo',
                    border: '1px solid',
                    borderColor: 'institucional.rojo',
                },
            },
        },
        IconButton: {
            variants: {
                institucionalAzul: {
                    bg: 'institucional.azul',
                    color: 'white',
                    _hover: {
                        bg: 'institucional.azulClaro',
                        transform: 'scale(1.05)',
                    },
                    _active: {
                        bg: 'institucional.azulOscuro',
                    },
                },
                institucionalRojo: {
                    bg: 'institucional.rojo',
                    color: 'white',
                    _hover: {
                        bg: 'institucional.rojoClaro',
                        transform: 'scale(1.05)',
                    },
                    _active: {
                        bg: 'institucional.rojoOscuro',
                    },
                },
            },
        },
    },
    styles: {
        global: {
            '::selection': {
                bg: 'institucional.azulBg',
                color: 'institucional.azul',
            },
        },
    },
});

export default theme;