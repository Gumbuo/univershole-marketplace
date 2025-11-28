import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://univershole.xyz'),
  title: "FoxHole's Pixel Characters and Maps Marketplace",
  description: "Premium pixel art: Characters $3, Objects $2, Tilesets $8 - Pay with crypto or PayPal, commercial license included",
  openGraph: {
    title: "FoxHole's Pixel Characters and Maps Marketplace",
    description: "Premium pixel art: Characters $3, Objects $2, Tilesets $8 - Pay with crypto or PayPal, commercial license included",
    url: "https://univershole.xyz",
    siteName: "FoxHole's Pixel Marketplace",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "FoxHole's Pixel Characters and Maps Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoxHole's Pixel Characters and Maps Marketplace",
    description: "Premium pixel art: Characters $3, Objects $2, Tilesets $8 - Pay with crypto or PayPal, commercial license included",
    images: ["/banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
