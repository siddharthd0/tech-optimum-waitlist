import '@/styles/globals.css'
import { ChakraProvider, extendTheme, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import useMemo from 'react';
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  fonts: {
    heading: '"Avenir Next", sans-serif',
    body: '"Avenir Next", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'gray.100',
      },
    },
  },
});



function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{ useSystemColorMode: false }}>
        <CSSReset />
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}
export default MyApp
