import type { Metadata } from "next";
import { FathomAnalytics } from "./fathom";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.audiowords.net"),
  title: "Audiophile Terminology Guide",
  description:
    "Explore the language of audio with interactive charts and curated examples.",
  keywords:
    "audiophile, audio terminology, frequency response, sound quality, audio terms, audio guide",
  openGraph: {
    type: "website",
    title: "Audiophile Terminology Guide",
    description:
      "Explore the language of audio with interactive charts and curated examples.",
    url: "/",
    siteName: "Audiophile Terminology Guide",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Audiophile Terminology Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audiophile Terminology Guide",
    description:
      "Explore the language of audio with interactive charts and curated examples.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="color-scheme" content="dark only" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="msapplication-navbutton-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-title" content="Audiophile Terms" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased">
        <FathomAnalytics />
        {children}
      </body>
    </html>
  );
}
