import { Assistant, JetBrains_Mono } from "next/font/google";
import { ClientProvider } from "@/components/ClientProvider";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Avihu - CRM אישי לסוכן ביטוח",
  description: "מערכת לניהול תיק לקוחות, מוצרים ביטוחיים ופיננסיים",
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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
