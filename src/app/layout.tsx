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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
