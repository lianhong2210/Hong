import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode'),d=document.documentElement;if(m==='light'||m==='dark'){d.setAttribute('data-theme',m);}else{var p=window.matchMedia('(prefers-color-scheme:dark)');d.setAttribute('data-theme',p.matches?'dark':'light');}}catch(e){document.documentElement.setAttribute('data-theme','dark');}d.style.visibility='hidden'})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href={`${process.env.BASE_PATH || ""}/favicon.png`}
          type="image/png"
        />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
