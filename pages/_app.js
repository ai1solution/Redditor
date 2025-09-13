import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';

const theme = extendTheme({
  config: { initialColorMode: 'system', useSystemColorMode: true },
  colors: {
    brand: {
      50: '#FFF1EB',
      100: '#FFDCCF',
      200: '#FFBCA3',
      300: '#FF9C77',
      400: '#FF7D4B',
      500: '#FF4500', // Reddit Orange
      600: '#E63E00',
      700: '#CC3700',
      800: '#B33100',
      900: '#992A00',
    },
    redditBlue: '#0079D3',
  },
  fonts: {
    heading: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    body: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
      baseStyle: { borderRadius: '8px', fontWeight: '600' },
      variants: {
        solid: {
          boxShadow: 'sm',
          _hover: { boxShadow: 'md' },
          _active: { transform: 'translateY(1px)' },
        },
        ghost: { _hover: { bg: 'blackAlpha.50' } },
      },
    },
    Tag: {
      baseStyle: { borderRadius: '6px', fontWeight: '600' },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'blackAlpha.50',
            _hover: { bg: 'blackAlpha.100' },
            _focus: { bg: 'transparent', borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' },
          },
        },
      },
      defaultProps: { variant: 'filled' },
    },
  },
  styles: {
    global: (props) => ({
      'html, body': {
        background: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
      },
      a: {
        transition: 'color .2s ease',
      },
    }),
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
