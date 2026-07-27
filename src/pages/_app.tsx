import type { AppProps } from "next/app";
import Head from "next/head";
import MuiProvider from "../components/MuiProvider";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ScrollProvider } from "../contexts/ScrollContext";
import "../styles/_variables.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Lim Lian Hong</title>
        <meta name="description" content="Portfolio of Lim Lian Hong" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          html { scroll-behavior: smooth; }
          body { overflow-x: hidden; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: var(--scrollbar-track, #0A0F1E); }
          ::-webkit-scrollbar-thumb { background: #6B7A99; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #00D4AA; }
          ::selection { background: #00D4AA; color: #0A0F1E; }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        `}</style>
      </Head>
      <ThemeProvider>
        <MuiProvider>
          <ScrollProvider>
            <Component {...pageProps} />
          </ScrollProvider>
        </MuiProvider>
      </ThemeProvider>
    </>
  );
}
