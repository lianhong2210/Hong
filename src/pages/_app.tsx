import type { AppProps } from "next/app";
import Head from "next/head";
import MuiProvider from "../components/MuiProvider";

// ** Contexts
import { ScrollProvider } from "../contexts/ScrollContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../store";

// ** Styles
import "../styles/_variables.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Lim Lian Hong - Full Stack Software Engineer</title>
        <meta name="description" content="Lim Lian Hong's Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          html { scroll-behavior: smooth; zoom: 0.8; }
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
    </Provider>
  );
}
