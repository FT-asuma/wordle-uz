import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import Loading from "./loading";
import AppProvider from "@/context/AppContext";
const mont = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "100", "300", "900"],
  variable: "--font-mont",
});

export const metadata: Metadata = {
  title: "A fun Puzzle-game",
  description:
    "Hi everyone, please note that this is not a direct copy of wordle.org! I have only been inspired by that website!",
  icons: {
    icon: "/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={mont.className}>
        <Analytics />
        <Suspense fallback={<Loading />}>
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
