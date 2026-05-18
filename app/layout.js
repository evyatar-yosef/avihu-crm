import { Assistant, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "Avihu - CRM אישי לסוכן ביטוח",
  description: "מערכת לניהול תיק לקוחות, מוצרים ביטוחיים ופיננסיים",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
      data-density="regular"
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
