import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata = {
  title: "KrpaDevelopment | Web template-i za male biznise",
  description:
    "Gotovi web template-i za frizerske salone, restorane, barbershopove i male biznise. Moderan dizajn, hosting i support.",
  keywords: [
    "KrpaDevelopment",
    "web stranice",
    "izrada web stranica",
    "web template",
    "frizerski salon web stranica",
    "barbershop web stranica",
    "restoran web stranica",
    "web dizajn Hrvatska"
  ],
  openGraph: {
    title: "KrpaDevelopment | Web template-i za male biznise",
    description:
      "Gotovi web template-i za salone, restorane i male biznise. Brzo, moderno i profesionalno.",
    url: "https://krpadevelopment.shop",
    siteName: "KrpaDevelopment",
    locale: "hr_HR",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="hr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}