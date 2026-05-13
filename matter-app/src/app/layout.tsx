import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matter — Di lo que sientes",
  description: "Descarga tu estrés, materialízalo, y suéltalo. No es terapia. Es mejor.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#071A1E",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
