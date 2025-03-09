import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO, social sharing, and browser icon
export const metadata: Metadata = {
  title: "Globetrotter Challenge",
  description: "Geo guessing game",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Globetrotter Challenge",
    description:
      "Test your geography skills with the ultimate geo guessing game!",
    url: "https://globetrotter-challenge.vercel.app", // Your website URL
    siteName: "Globetrotter Challenge",
    images: [
      {
        url: "https://globetrotter-challenge.vercel.app/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Globetrotter Challenge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Globetrotter Challenge",
    description:
      "Test your geography skills with the ultimate geo guessing game!",
    images: ["https://globetrotter-challenge.vercel.app/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
