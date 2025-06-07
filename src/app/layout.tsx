import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.audiowords.net'),
  title: "Audiophile Terminology Guide",
  description: "Interactive reference guide for audiophile terminology. Explore audio terms with sentiment analysis, frequency charts, and detailed explanations.",
  keywords: "audiophile, audio terminology, frequency response, sound quality, audio terms, audio guide",
  openGraph: {
    type: "website",
    title: "Audiophile Terminology Guide",
    description: "Interactive reference guide for audiophile terminology. Explore audio terms with sentiment analysis, frequency charts, and detailed explanations.",
    url: "/",
    siteName: "Audiophile Terminology Guide",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Audiophile Terminology Guide"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Audiophile Terminology Guide",
    description: "Interactive reference guide for audiophile terminology. Explore audio terms with sentiment analysis, frequency charts, and detailed explanations.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="color-scheme" content="dark only" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="msapplication-navbutton-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-title" content="Audiophile Terms" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
