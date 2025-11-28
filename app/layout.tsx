import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FoxHole's Pixel Characters and Maps Marketplace",
  description: "Buy premium pixel art game characters and maps with crypto or PayPal - $5 each with commercial license",
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
