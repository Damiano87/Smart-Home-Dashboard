import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.scss";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar/Navbar";
import { Suspense } from "react";
import Skeleton from "./components/Skeleton/Skeleton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Home",
  description: "Smart Home Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<Skeleton />}>
            <Navbar />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
