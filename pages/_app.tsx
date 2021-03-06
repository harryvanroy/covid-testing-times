import "../styles/globals.css";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { LocationProvider } from "../context/LocationContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Covid testing times app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChakraProvider>
          <LocationProvider>
            <Component {...pageProps} />
          </LocationProvider>
        </ChakraProvider>
      </main>
    </>
  );
}

export default MyApp;
