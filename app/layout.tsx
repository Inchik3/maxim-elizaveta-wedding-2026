import type { Metadata } from "next";
import { Cormorant_Garamond, Marck_Script } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Marck_Script({
  variable: "--font-script",
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Максим & Елизавета — свадебное приглашение";
  const description =
    "Приглашаем вас разделить с нами день рождения нашей семьи — 29 августа 2026 года.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      locale: "ru_RU",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1735,
          height: 909,
          alt: "Максим и Елизавета — 29 августа 2026",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${serif.variable} ${script.variable}`}>{children}</body>
    </html>
  );
}
