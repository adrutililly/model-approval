import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // ✅ import the wrapper
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "App",
  description: "Created",
  generator: "dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers> {/* ✅ wrap with SessionProvider */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
