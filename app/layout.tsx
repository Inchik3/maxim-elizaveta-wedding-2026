import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export function generateMetadata(): Metadata {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://inchik3.github.io/maxim-elizaveta-wedding-2026";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const title = "Максим & Елизавета — свадебное приглашение";
  const description =
    "Приглашаем вас разделить с нами день рождения нашей семьи — 29 августа 2026 года.";
  const socialImageUrl = `${siteUrl}${basePath}/og.png`;

  return {
    metadataBase: new URL(`${siteUrl}${basePath}/`),
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      locale: "ru_RU",
      images: [
        {
          url: socialImageUrl,
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
      images: [socialImageUrl],
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
      <body className={`${serif.variable} ${script.variable}`}>
        {children}
      </body>
    </html>
  );
}
