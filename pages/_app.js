import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';

// Revamped Chakra theme for a cleaner, trendy, and consistent UI
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
  semanticTokens: {
    colors: {
      bgPage: { default: 'gray.50', _dark: 'gray.900' },
      bgCard: { default: 'white', _dark: 'gray.800' },
      borderSubtle: { default: 'gray.200', _dark: 'gray.700' },
      textMuted: { default: 'gray.600', _dark: 'gray.400' },
    },
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
  space: {
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
  },
  shadows: {
    xs: '0 1px 2px rgba(16,24,40,0.04), 0 1px 1px rgba(16,24,40,0.04)',
    sm: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.1)',
    md: '0 2px 4px rgba(16,24,40,0.08), 0 4px 8px rgba(16,24,40,0.08)',
  },
  fonts: {
    heading: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    body: 'IBM Plex Sans, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  layerStyles: {
    card: {
      bg: 'bgCard',
      borderWidth: '1px',
      borderColor: 'borderSubtle',
      rounded: 'md',
      p: 5,
      boxShadow: 'sm',
    },
  },
  textStyles: {
    subtle: { color: 'textMuted' },
  },
  components: {
    Container: {
      defaultProps: { maxW: '7xl', px: 6 },
    },
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
        outline: { _hover: { bg: 'blackAlpha.50' } },
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
    Select: {
      defaultProps: { size: 'sm' },
    },
    Modal: {
      baseStyle: {
        dialog: { rounded: 'md' },
      },
    },
  },
  styles: {
    global: (props) => ({
      'html, body': {
        background: props.colorMode === 'light' ? 'var(--chakra-colors-gray-50)' : 'var(--chakra-colors-gray-900)',
      },
      '*, *::before, *::after': { boxSizing: 'border-box' },
      a: { transition: 'color .2s ease' },
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
