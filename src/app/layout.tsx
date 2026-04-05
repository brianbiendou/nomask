import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
