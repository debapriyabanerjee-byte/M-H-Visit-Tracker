import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/layout/providers";
import { APP_NAME } from "@/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Internal field-visit capture for InsuranceDekho M&H leadership.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#B71C1C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
