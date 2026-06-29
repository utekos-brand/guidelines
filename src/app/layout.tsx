import "./globals.css";
import { Google_Sans_Flex } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";
import {
  COLOR_MODE_COOKIE_NAME,
  DEFAULT_COLOR_MODE,
  DEFAULT_THEME,
  THEME_COOKIE_NAME,
} from "@/config/brand-themes";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

const themeBootstrapScript = `
(() => {
  try {
    const themeMatch = document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]*)/)
    const modeMatch = document.cookie.match(/(?:^|; )${COLOR_MODE_COOKIE_NAME}=([^;]*)/)
    const theme = themeMatch ? decodeURIComponent(themeMatch[1]) : '${DEFAULT_THEME}'
    const colorMode = modeMatch ? decodeURIComponent(modeMatch[1]) : '${DEFAULT_COLOR_MODE}'

    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.colorMode = colorMode
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
  } catch {}
})()
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://brand.utekos.no"),
  title: {
    default: "Utekos Brand Guidelines",
    template: "%s | Utekos Brand Guidelines",
  },
  description: "Interne brand guidelines og fargeverktøy for Utekos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      data-theme={DEFAULT_THEME}
      data-color-mode={DEFAULT_COLOR_MODE}
      className={googleSansFlex.variable}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="brand-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
        {children}
      </body>
    </html>
  );
}
